import React, { useState, useEffect } from 'react';
import Hero from '@/components/ui/Hero';
import CourseGrid from '@/components/features/courses/CourseGrid';
import StatsSection from '@/components/features/stats/StatsSection';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { CourseProps } from '@/components/features/courses/CourseCard';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const [featuredCourses, setFeaturedCourses] = useState<CourseProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleRegisterClick = (e: React.MouseEvent) => {
    if (isAuthenticated) {
      e.preventDefault();
      navigate('/courses');
    }
  };

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/courses/featured');
        
        if (response.data.status === 'success') {
          const coursesData = response.data.data.courses.map((course: any) => ({
            id: course.id,
            title: course.title,
            description: course.description,
            thumbnail: course.thumbnail || 'https://placehold.co/600x400?text=EPU+Learning',
            enrollmentCount: course.enrollment_count || 0,
            chapterCount: course.chapter_count || 0
          }));
          
          setFeaturedCourses(coursesData);
        }
      } catch (error) {
        console.error('Error fetching featured courses:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải khóa học nổi bật. Vui lòng thử lại sau.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedCourses();
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />
      
      {isLoading ? (
        <section className="section-padding">
          <div className="container flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </section>
      ) : featuredCourses.length > 0 ? (
        <CourseGrid 
          title="Khóa học nổi bật" 
          description="Khám phá các khóa học hàng đầu của chúng tôi được thiết kế để giúp bạn phát triển kỹ năng mới"
          courses={featuredCourses}
        />
      ) : null}
      
      <StatsSection />
      
      <section className="section-padding bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-lg mb-4">Sẵn sàng để bắt đầu hành trình học tập của bạn?</h2>
            <p className="text-lg mb-8 opacity-90">
              Tham gia cùng hơn 5,000 học viên đang học tập và phát triển cùng EPU Learning Hub
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses">
                <Button size="lg" variant="secondary" className="gap-1">
                  Khám phá khóa học
                </Button>
              </Link>
              <Link to={isAuthenticated ? "/courses" : "/auth/register"} onClick={handleRegisterClick}>
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  {isAuthenticated ? "Xem khóa học" : "Đăng ký miễn phí"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section-padding">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-lg mb-4">Về Học liệu EPU</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Chúng tôi tập trung vào việc cung cấp nền tảng học tập trực tuyến chất lượng cao, 
                giúp sinh viên tiếp cận kiến thức mọi lúc mọi nơi.
              </p>
              <ul className="space-y-3">
                {[
                  'Nội dung cập nhật theo xu hướng mới nhất',
                  'Giảng viên giàu kinh nghiệm và chuyên môn cao',
                  'Hỗ trợ học tập 24/7',
                  'Chứng chỉ được công nhận rộng rãi'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/about">
                  <Button variant="outline">Tìm hiểu thêm</Button>
                </Link>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden aspect-video">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                alt="Students learning" 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
