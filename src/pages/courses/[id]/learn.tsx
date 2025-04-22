import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Page {
  id: number;
  lesson_id: number;
  page_number: number;
  page_type: string;
  content: string;
}

interface Chapter {
  id: number;
  title: string;
  description: string;
  order_index: number;
}

interface Lesson {
  id: number;
  chapter_id: number;
  title: string;
  content: string;
  order_index: number;
  pages?: Page[];
  total_pages?: number;
}

const CourseLearnPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageContent, setPageContent] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Bạn cần đăng nhập",
        description: "Vui lòng đăng nhập để truy cập khóa học",
        variant: "destructive",
      });
      navigate('/auth/login');
      return;
    }

    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/courses/${id}`);
        
        console.log('Course API response:', response.data);
        
        if (response.data.status === 'success' && response.data.data) {
          const courseData = response.data.data.course;
          setCourse(courseData);
          
          console.log('Course chapters:', courseData.chapters);
          setChapters(courseData.chapters || []);
          
          // Flatten all lessons from all chapters
          const allLessons = courseData.chapters?.flatMap((chapter: any) => {
            console.log('Chapter lessons:', chapter.id, chapter.lessons);
            return chapter.lessons?.map((lesson: any) => ({
              ...lesson,
              chapter_id: chapter.id
            })) || [];
          }) || [];
          
          console.log('All lessons:', allLessons);
          setLessons(allLessons);
          
          // Set active chapter and lesson if available
          if (courseData.chapters && courseData.chapters.length > 0) {
            setActiveChapter(courseData.chapters[0].id);
            
            if (courseData.chapters[0].lessons && courseData.chapters[0].lessons.length > 0) {
              const firstLesson = courseData.chapters[0].lessons[0];
              setActiveLesson(firstLesson);
              setCurrentPage(1);
              
              // Nếu có nhiều trang, lấy nội dung trang đầu tiên
              if (firstLesson.pages && firstLesson.pages.length > 0) {
                setPageContent(firstLesson.pages[0].content);
              } else {
                setPageContent(firstLesson.content || '');
              }
              
              console.log('Active lesson set to:', firstLesson);
            }
          }
        } else {
          console.error('API response format incorrect:', response.data);
          toast({
            title: "Lỗi định dạng dữ liệu",
            description: "Dữ liệu khóa học không đúng định dạng",
            variant: "destructive",
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course data:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu khóa học",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    // Check if user is enrolled in this course
    const checkEnrollment = async () => {
      try {
        const response = await axios.get('/api/courses/user/enrolled');
        
        // Cập nhật cách xử lý dữ liệu
        let enrolledCourses = [];
        if (response.data.status === 'success' && response.data.data) {
          enrolledCourses = response.data.data.courses;
        } else if (response.data.courses) {
          // Fallback cho cấu trúc API khác
          enrolledCourses = response.data.courses;
        } else {
          console.error('Unexpected API response format:', response.data);
        }
        
        console.log('Enrolled courses:', enrolledCourses);
        
        // So sánh với id của khóa học hiện tại (chuyển sang số)
        const courseIdNumber = parseInt(id as string, 10);
        const isEnrolled = enrolledCourses.some((course: any) => {
          const courseId = course.course_id || course.id;
          return courseId === courseIdNumber;
        });
        
        console.log('Is enrolled:', isEnrolled, 'Current course ID:', courseIdNumber);
        
        if (!isEnrolled) {
          toast({
            title: "Chưa đăng ký",
            description: "Bạn chưa đăng ký khóa học này",
            variant: "destructive",
          });
          navigate(`/courses/${id}`);
          return false;
        }
        
        return true;
      } catch (error) {
        console.error('Error checking enrollment:', error);
        toast({
          title: "Lỗi",
          description: "Không thể kiểm tra trạng thái đăng ký",
          variant: "destructive",
        });
        navigate(`/courses/${id}`);
        return false;
      }
    };

    const init = async () => {
      const enrolled = await checkEnrollment();
      if (enrolled) {
        await fetchCourseData();
      }
    };

    init();
  }, [id, isAuthenticated, navigate, toast, user]);

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setActiveChapter(lesson.chapter_id);
    setCurrentPage(1);
    
    // Nếu bài học có nhiều trang, hiển thị trang đầu tiên
    if (lesson.pages && lesson.pages.length > 0) {
      setPageContent(lesson.pages[0].content);
    } else {
      setPageContent(lesson.content || '');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (!activeLesson || !activeLesson.pages) return;
    
    if (newPage >= 1 && newPage <= (activeLesson.total_pages || 1)) {
      setCurrentPage(newPage);
      setPageContent(activeLesson.pages[newPage - 1]?.content || '');
    }
  };

  const handleNextPage = () => {
    if (activeLesson && currentPage < (activeLesson.total_pages || 1)) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (activeLesson && currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div className="md:col-span-3 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  const getChapterLessons = (chapterId: number) => {
    return lessons.filter(lesson => lesson.chapter_id === chapterId);
  };

  // Bài học có phân trang không?
  const hasMultiplePages = activeLesson && activeLesson.total_pages && activeLesson.total_pages > 1;

  return (
    <div className="container py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate(`/courses/${id}`)} 
        className="mb-4"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại khóa học
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar with chapters and lessons */}
        <div className="md:col-span-1 border rounded-lg p-4 bg-card">
          <h3 className="text-xl font-semibold mb-4">Nội dung khóa học</h3>
          <div className="space-y-4">
            {chapters && chapters.length > 0 ? (
              chapters.map((chapter) => (
                <div key={chapter.id} className="space-y-2">
                  <h4 className="font-medium text-lg">{chapter.title}</h4>
                  <p className="text-sm text-muted-foreground">{chapter.description}</p>
                  <div className="space-y-1">
                    {getChapterLessons(chapter.id).length > 0 ? (
                      getChapterLessons(chapter.id).map((lesson) => (
                        <Button
                          key={lesson.id}
                          variant={activeLesson?.id === lesson.id ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => handleSelectLesson(lesson)}
                        >
                          {lesson.title}
                        </Button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground py-2 px-4">
                        Chưa có bài học trong chương này
                      </p>
                    )}
                  </div>
                  <Separator className="my-2" />
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Khóa học chưa có nội dung</p>
                <p className="text-sm mt-2">Vui lòng quay lại sau</p>
              </div>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div className="md:col-span-3">
          {activeLesson ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{activeLesson.title}</h2>
                {hasMultiplePages && (
                  <div className="text-sm text-muted-foreground">
                    Trang {currentPage}/{activeLesson.total_pages}
                  </div>
                )}
              </div>
              <Separator />

              {/* Lesson content */}
              <div className="prose max-w-none dark:prose-invert mb-8" 
                   dangerouslySetInnerHTML={{ __html: pageContent || 'Không có nội dung' }} 
              />

              {/* Pagination controls */}
              {hasMultiplePages && (
                <div className="flex justify-between items-center mt-8 border-t pt-4">
                  <Button
                    variant="outline"
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Trang trước
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: activeLesson.total_pages || 0 }).map((_, index) => (
                      <Button
                        key={index}
                        variant={currentPage === index + 1 ? "default" : "outline"}
                        className="w-8 h-8 p-0"
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={currentPage >= (activeLesson.total_pages || 1)}
                    className="flex items-center gap-2"
                  >
                    Trang tiếp
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg bg-muted/50 p-6 text-center">
              <p className="text-muted-foreground mb-4">Vui lòng chọn một bài học để bắt đầu</p>
              {chapters && chapters.length > 0 ? (
                <p className="text-sm">Chọn một bài học từ danh sách bên trái để xem nội dung</p>
              ) : (
                <p className="text-sm">Hiện tại khóa học chưa có nội dung, vui lòng quay lại sau</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseLearnPage; 