
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

const developers = [
  {
    name: "Nguyễn Thế Dũng",
    role: "Full Stack Developer",
    description: "Phát triển giao diện người dùng và quản lý cơ sở dữ liệu",
    image: "/images/dung.png"
  },
  {
    name: "Nguyễn Hải Nam",
    role: "Frontend Developer",
    description: "Thiết kế và phát triển giao diện người dùng",
    image: "/images/nam.png"
  },
  {
    name: "Đình Văn Linh",
    role: "Backend Developer",
    description: "Phát triển và tối ưu hóa hệ thống máy chủ",
    image: "/images/linh.png"
  },
  {
    name: "Tống Văn Cao",
    role: "Database Administrator",
    description: "Quản lý và tối ưu hóa cơ sở dữ liệu",
    image: "/images/cao.png"
  },
  {
    name: "Nguyễn Hoàng Anh Thái",
    role: "Database Administrator",
    description: "Hỗ trợ ngân sách và tài chính",
    image: "/images/thai.png"
  },
  {
    name: "Phạm Thanh Tuyền",
    role: "Database Administrator",
    description: "Quản lý ngân sách và tài chính",
    image: "/images/tuyen.png"
  }
];

const AboutPage = () => {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Đội ngũ phát triển</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Chúng tôi là nhóm sinh viên đam mê công nghệ, cùng nhau xây dựng nền tảng học tập trực tuyến 
          để mang đến trải nghiệm học tập tốt nhất cho sinh viên EPU.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        {developers.map((dev, index) => (
          <Card key={index} className="text-center">
            <CardHeader className="pb-4">
            <div className="w-20 h-20 mx-auto mb-4">
              <img
                src={dev.image}
                alt={dev.name}
                className="w-20 h-20 object-cover rounded-full border border-gray-300 shadow"
              />
            </div>
              <CardTitle className="text-xl">{dev.name}</CardTitle>
              <CardDescription>{dev.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">{dev.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
