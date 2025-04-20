
import React from 'react';
import { Book, Users, Award, Clock } from 'lucide-react';

// These could later be populated from the backend
const stats = [
  {
    icon: Book,
    value: '0',
    label: 'Khóa học',
    description: 'Đa dạng chủ đề học tập'
  },
  {
    icon: Clock,
    value: '0',
    label: 'Giờ học',
    description: 'Nội dung chất lượng cao'
  },
  {
    icon: Users,
    value: '0',
    label: 'Học viên',
    description: 'Cùng nhau học tập và phát triển'
  },
  {
    icon: Award,
    value: '0%',
    label: 'Tỷ lệ hoàn thành',
    description: 'Học viên đạt chứng chỉ'
  }
];

const StatsSection = () => {
  return (
    <section className="bg-muted/50 section-padding">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="font-medium mb-2">{stat.label}</p>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
