import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleRegisterClick = (e: React.MouseEvent) => {
    if (isAuthenticated) {
      e.preventDefault();
      navigate('/courses');
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/10" />
      <div className="container py-16 md:py-24 relative z-10">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col gap-4">
            <h1 className="heading-xl animate-fade-in text-slate-900">
              Học liệu EPU
              <span className="block text-primary">Kiến thức không giới hạn</span>
            </h1>
            <p className="text-xl text-muted-foreground animate-fade-in [animation-delay:200ms]">
              Nền tảng học tập trực tuyến hiện đại, kết nối giáo viên và sinh viên trong một môi trường học tập số hoá.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in [animation-delay:400ms]">
              <Link to="/courses">
                <Button size="lg" className="gap-1">
                  Khám phá khóa học
                </Button>
              </Link>
              <Link to={isAuthenticated ? "/courses" : "/auth/register"} onClick={handleRegisterClick}>
                <Button variant="outline" size="lg">
                  {isAuthenticated ? "Xem khóa học" : "Đăng ký miễn phí"}
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-8 mt-4 animate-fade-in [animation-delay:600ms]">
              <div>
                <p className="text-2xl font-bold">200+</p>
                <p className="text-sm text-muted-foreground">Khóa học</p>
              </div>
              <div>
                <p className="text-2xl font-bold">5,000+</p>
                <p className="text-sm text-muted-foreground">Học viên</p>
              </div>
              <div>
                <p className="text-2xl font-bold">95%</p>
                <p className="text-sm text-muted-foreground">Tỷ lệ hoàn thành</p>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary to-secondary p-1 shadow-2xl">
              <div className="h-full w-full rounded-xl bg-white/90 backdrop-blur overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                  alt="EPU Learning Platform" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
