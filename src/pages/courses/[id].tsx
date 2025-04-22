import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Clock,
  ChevronRight,
  FileText,
  Users,
  CheckCircle,
  Loader2,
  PlayCircle
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface Lesson {
  id: number;
  title: string;
  lesson_order: number;
}

interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

interface Chapter {
  id: number;
  title: string;
  chapter_order: number;
  lessons: Lesson[];
  lesson_count: number;
  questions?: Question[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  chapter_count: number;
  lesson_count: number;
  enrollment_count: number;
  chapters: Chapter[];
  estimatedHours?: number;
}

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [courseQuestions, setCourseQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (!isAuthenticated || !user) {
        setIsEnrolled(false);
        return;
      }
      
      try {
        const response = await axios.get('/api/courses/user/enrolled');
        let enrolledCourses = [];
        
        if (response.data.status === 'success' && response.data.data) {
          enrolledCourses = response.data.data.courses;
        } else if (response.data.courses) {
          enrolledCourses = response.data.courses;
        }
        
        // Kiểm tra xem người dùng đã đăng ký khóa học này chưa
        const courseIdNum = parseInt(id as string, 10);
        const enrolled = enrolledCourses.some((course: any) => {
          const courseId = course.course_id || course.id;
          return courseId === courseIdNum;
        });
        
        setIsEnrolled(enrolled);
      } catch (error) {
        console.error('Error checking enrollment status:', error);
        setIsEnrolled(false);
      }
    };
    
    checkEnrollmentStatus();
  }, [id, isAuthenticated, user]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setIsFetching(true);
      try {
        const response = await axios.get(`/api/courses/${id}`);
        
        if (response.data.status === 'success') {
          const courseData = response.data.data.course;
          
          // Tính toán số giờ ước tính dựa trên số bài học
          const estimatedHours = Math.max(1, Math.ceil(courseData.lesson_count / 2));
          
          setCourse({
            ...courseData,
            thumbnail: courseData.thumbnail || 'https://placehold.co/600x400?text=EPU+Learning',
            estimatedHours
          });
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin khóa học. Vui lòng thử lại sau.",
          variant: "destructive"
        });
        setCourse(null);
      } finally {
        setIsFetching(false);
      }
    };
    
    if (id) {
      fetchCourseDetails();
    }
  }, [id, toast]);
  
  // Tải câu hỏi cho khóa học
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!id) return;
      
      setIsQuestionsLoading(true);
      try {
        // Ở đây, thông thường sẽ fetch từ API, nhưng vì chúng ta chưa có dữ liệu thật, 
        // sử dụng mảng trống và tạo câu hỏi mẫu trong UI
        // const response = await axios.get(`/api/questions/course/${id}`);
        // if (response.data.status === 'success') {
        //   setCourseQuestions(response.data.data.chapters);
        // }
        
        // Mẫu dữ liệu giả cho câu hỏi
        if (course && course.chapters) {
          const sampleQuestions = course.chapters.map(chapter => ({
            chapter_id: chapter.id,
            chapter_title: chapter.title,
            questions: Array(5).fill(0).map((_, i) => ({
              id: i + 1,
              question_text: `Câu hỏi ${i + 1} liên quan đến ${chapter.title.toLowerCase()}?`,
              option_a: 'Đáp án A',
              option_b: 'Đáp án B',
              option_c: 'Đáp án C', 
              option_d: 'Đáp án D',
              correct_answer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]
            }))
          }));
          
          setCourseQuestions(sampleQuestions);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setCourseQuestions([]);
      } finally {
        setIsQuestionsLoading(false);
      }
    };
    
    if (course) {
      fetchQuestions();
    }
  }, [id, course]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để đăng ký khóa học.",
        variant: "destructive"
      });
      navigate('/auth/login');
      return;
    }

    setIsLoading(true);
    
    try {
      // Gọi API đăng ký khóa học
      const response = await axios.post(`/api/courses/${id}/enroll`);
      
      toast({
        title: "Đăng ký thành công!",
        description: `Bạn đã đăng ký khóa học "${course?.title}" thành công`,
      });

      // Chuyển hướng đến trang chi tiết khóa học hoặc trang học tập
      navigate(`/courses/${id}/learn`);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      
      // Kiểm tra nếu lỗi là do đã đăng ký trước đó
      if (error.response && error.response.status === 400) {
        toast({
          title: "Thông báo",
          description: error.response.data.message || "Bạn đã đăng ký khóa học này rồi.",
        });
        // Vẫn chuyển hướng đến trang học tập
        navigate(`/courses/${id}/learn`);
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể đăng ký khóa học. Vui lòng thử lại sau.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const continueLearning = () => {
    navigate(`/courses/${id}/learn`);
  };

  if (isFetching) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold">Không tìm thấy khóa học</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          Khóa học bạn tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link to="/courses">
          <Button>Quay lại danh sách khóa học</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Course Header */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
              <p className="text-lg opacity-90">{course.description}</p>
              
              <div className="flex flex-wrap gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{course.chapter_count} chương</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span>{course.lesson_count} bài học</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.estimatedHours} giờ học</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{course.enrollment_count} học viên</span>
                </div>
              </div>
              
              <div className="mt-8">
                {isEnrolled ? (
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="gap-2"
                    onClick={continueLearning}
                  >
                    Tiếp tục học
                    <PlayCircle className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="gap-2"
                    onClick={handleEnroll}
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang xử lý..." : "Đăng ký học ngay"}
                    {!isLoading && <ChevronRight className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </div>
            
            <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Course Content */}
      <section className="py-12">
        <div className="container">
          <Tabs defaultValue="curriculum">
            <TabsList className="mb-8">
              <TabsTrigger value="curriculum">Nội dung khóa học</TabsTrigger>
              <TabsTrigger value="questions">Câu hỏi</TabsTrigger>
            </TabsList>
            
            <TabsContent value="curriculum" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Chương trình học</h2>
              
              <div className="space-y-4">
                {course.chapters && course.chapters.length > 0 ? (
                  course.chapters.map((chapter) => (
                    <Card key={chapter.id} className="overflow-hidden">
                      <div className="bg-muted p-4 font-medium text-lg border-b">
                        {chapter.title}
                      </div>
                      <CardContent className="p-0">
                        <ul className="divide-y">
                          {chapter.lessons && chapter.lessons.length > 0 ? (
                            chapter.lessons.map((lesson) => (
                              <li key={lesson.id} className="p-4 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span>{lesson.title}</span>
                                </div>
                              </li>
                            ))
                          ) : (
                            <li className="p-4 text-muted-foreground">Chưa có bài học nào trong chương này</li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Khóa học này chưa có nội dung</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="questions" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Câu hỏi theo chương</h2>
              
              {isQuestionsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {courseQuestions && courseQuestions.length > 0 ? (
                    courseQuestions.map((chapterData) => (
                      <Card key={chapterData.chapter_id} className="overflow-hidden">
                        <div className="bg-muted p-4 font-medium text-lg border-b flex justify-between items-center">
                          <span>{chapterData.chapter_title}</span>
                          <span className="text-sm text-muted-foreground">
                            {chapterData.questions.length} câu hỏi
                          </span>
                        </div>
                        <CardContent className="p-0">
                          <div className="p-4 space-y-4">
                            {chapterData.questions.slice(0, 3).map((question, qIndex) => (
                              <div key={qIndex} className="border rounded-md p-4">
                                <div className="font-medium mb-2">
                                  {qIndex + 1}. {question.question_text}
                                </div>
                                <div className="space-y-2 ml-4">
                                  {[
                                    {label: 'A', text: question.option_a},
                                    {label: 'B', text: question.option_b},
                                    {label: 'C', text: question.option_c},
                                    {label: 'D', text: question.option_d}
                                  ].map((option, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <input 
                                        type="radio" 
                                        name={`question-${chapterData.chapter_id}-${qIndex}`} 
                                        id={`option-${chapterData.chapter_id}-${qIndex}-${i}`}
                                        className="radio"
                                      />
                                      <label htmlFor={`option-${chapterData.chapter_id}-${qIndex}-${i}`}>
                                        {option.label}. {option.text}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                            
                            {chapterData.questions.length > 3 && (
                              <div className="mt-4 text-center">
                                <Button variant="outline">Xem thêm câu hỏi</Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Khóa học này chưa có câu hỏi</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default CourseDetailPage;
