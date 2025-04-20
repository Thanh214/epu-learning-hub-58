
import React from 'react';
import CourseCard, { CourseProps } from './CourseCard';

interface CourseGridProps {
  title?: string;
  description?: string;
  courses: CourseProps[];
}

const CourseGrid = ({ title, description, courses }: CourseGridProps) => {
  return (
    <section className="section-padding">
      <div className="container">
        {(title || description) && (
          <div className="flex flex-col gap-3 mb-8 text-center max-w-3xl mx-auto">
            {title && <h2 className="heading-lg">{title}</h2>}
            {description && <p className="text-muted-foreground text-lg">{description}</p>}
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseGrid;
