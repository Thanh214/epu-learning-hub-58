import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Loader2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

interface Lesson {
  id: number;
  title: string;
  lesson_order: number;
}

interface Chapter {
  id: number;
  title: string;
  chapter_order: number;
  lessons: Lesson[];
  lesson_count: number;
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
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();
  
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

  const handleEnroll = async () => {
    setIsLoading(true);
    
    try {
      // Trong thực tế, đây sẽ là một cuộc gọi API để đăng ký khóa học
      // await axios.post(`/api/courses/${id}/enroll`);
      
      // Mô phỏng cuộc gọi API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Đăng ký thành công!",
        description: `Bạn đã đăng ký khóa học "${course?.title}" thành công`,
      });
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast({
        title: "Lỗi",
        description: "Không thể đăng ký khóa học. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
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
            
            <TabsContent value="overview">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Giới thiệu khóa học</h2>
                    <p className="text-muted-foreground">
                      {course.description}
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Bạn sẽ học gì?</h2>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {[
                        'Hiểu cách React hoạt động và vai trò của Virtual DOM',
                        'Xây dựng components và quản lý state',
                        'Sử dụng React Hooks trong functional components',
                        'Xử lý forms và validation trong React',
                        'Triển khai routing với React Router',
                        'Quản lý state toàn cục với Redux hoặc Context API',
                        'Tối ưu hóa hiệu suất của ứng dụng React',
                        'Xây dựng và triển khai một dự án React thực tế'
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Yêu cầu</h2>
                    <ul className="space-y-2">
                      {[
                        'Kiến thức cơ bản về HTML, CSS và JavaScript',
                        'Hiểu biết về ES6+ syntax (arrow functions, destructuring, etc.)',
                        'Môi trường phát triển web cơ bản (VS Code, Node.js)',
                        'Không yêu cầu kinh nghiệm React trước đó'
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="h-5 w-5 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Thông tin khóa học</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cấp độ:</span>
                          <span className="font-medium">Cơ bản đến Nâng cao</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ngôn ngữ:</span>
                          <span className="font-medium">Tiếng Việt</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Thời lượng:</span>
                          <span className="font-medium">{course.estimatedHours} giờ</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Chương:</span>
                          <span className="font-medium">{course.chapter_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bài học:</span>
                          <span className="font-medium">{course.lesson_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Chứng chỉ:</span>
                          <span className="font-medium">Có</span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button className="w-full" onClick={handleEnroll} disabled={isLoading}>
                          {isLoading ? "Đang xử lý..." : "Đăng ký học ngay"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="py-8 text-center">
                <h3 className="text-2xl font-semibold mb-2">Đánh giá từ học viên</h3>
                <p className="text-muted-foreground mb-4">
                  Chưa có đánh giá nào cho khóa học này.
                </p>
                <Button variant="outline">Viết đánh giá đầu tiên</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default CourseDetailPage;
