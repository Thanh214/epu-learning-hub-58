
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Book, Users } from 'lucide-react';

export interface CourseProps {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  enrollmentCount?: number;
  chapterCount?: number;
}

const CourseCard = ({ id, title, description, thumbnail, enrollmentCount = 0, chapterCount = 0 }: CourseProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title} 
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
          <div className="flex items-center gap-4">
            <span className="flex items-center text-sm text-muted-foreground gap-1">
              <Book className="w-4 h-4" /> 
              {chapterCount} Chương
            </span>
            <span className="flex items-center text-sm text-muted-foreground gap-1">
              <Users className="w-4 h-4" /> 
              {enrollmentCount} học viên
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/courses/${id}`} className="w-full">
          <Button variant="outline" className="w-full">Chi tiết khóa học</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
