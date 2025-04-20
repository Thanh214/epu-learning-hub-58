
import React from 'react';
import Hero from '@/components/ui/Hero';
import CourseGrid from '@/components/features/courses/CourseGrid';
import StatsSection from '@/components/features/stats/StatsSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Sample course data
const featuredCourses = [
  {
    id: 1,
    title: 'Lập trình web với React',
    description: 'Học cách xây dựng ứng dụng web hiện đại với React, Hooks và Redux.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    enrollmentCount: 1240,
    chapterCount: 12,
  },
  {
    id: 2,
    title: 'Cơ sở dữ liệu SQL cơ bản đến nâng cao',
    description: 'Khám phá ngôn ngữ truy vấn SQL từ căn bản đến các kỹ thuật nâng cao.',
    thumbnail: 'https://images.unsplash.com/photo-1654278767692-3e5ea2eee5ed',
    enrollmentCount: 980,
    chapterCount: 10,
  },
  {
    id: 3,
    title: 'Thiết kế đồ họa với Adobe Illustrator',
    description: 'Học cách sử dụng Adobe Illustrator để tạo ra các thiết kế đồ họa chuyên nghiệp.',
    thumbnail: 'https://images.unsplash.com/photo-1611532736188-04d1edb5a3dc',
    enrollmentCount: 760,
    chapterCount: 8,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      
      <CourseGrid 
        title="Khóa học nổi bật" 
        description="Khám phá các khóa học hàng đầu của chúng tôi được thiết kế để giúp bạn phát triển kỹ năng mới"
        courses={featuredCourses}
      />
      
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
              <Link to="/auth/register">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  Đăng ký miễn phí
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
