
import React from 'react';
import CourseGrid from '@/components/features/courses/CourseGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import CategoryBar from '@/components/features/courses/CategoryBar';

// Sample course data
const allCourses = [
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
  {
    id: 4,
    title: 'Machine Learning cơ bản',
    description: 'Giới thiệu về Machine Learning và các thuật toán cơ bản trong AI.',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
    enrollmentCount: 1450,
    chapterCount: 14,
  },
  {
    id: 5,
    title: 'Phát triển ứng dụng di động với Flutter',
    description: 'Xây dựng ứng dụng di động đa nền tảng với Flutter framework.',
    thumbnail: 'https://images.unsplash.com/photo-1617040619263-41c5a9ca7521',
    enrollmentCount: 890,
    chapterCount: 11,
  },
  {
    id: 6,
    title: 'Quản lý dự án phần mềm',
    description: 'Học các phương pháp và kỹ thuật quản lý dự án phần mềm hiệu quả.',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
    enrollmentCount: 670,
    chapterCount: 9,
  },
  {
    id: 7,
    title: 'Mạng máy tính cơ bản',
    description: 'Tìm hiểu về các khái niệm và cấu trúc cơ bản của mạng máy tính.',
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8',
    enrollmentCount: 820,
    chapterCount: 10,
  },
  {
    id: 8,
    title: 'An toàn và bảo mật thông tin',
    description: 'Học cách bảo vệ hệ thống thông tin khỏi các mối đe dọa và tấn công mạng.',
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
    enrollmentCount: 950,
    chapterCount: 12,
  },
];

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [filteredCourses, setFilteredCourses] = React.useState(allCourses);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterCourses(searchTerm, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterCourses(searchTerm, category);
  };

  const filterCourses = (search: string, category: string) => {
    let filtered = allCourses;

    // Apply search filter
    if (search) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filter
    if (category !== 'all') {
      // In a real application, you would filter based on actual category data
      // This is just a demonstration
      filtered = filtered.filter(course => {
        // Simulating category filtering - you should adjust this based on your actual data structure
        const courseCategories: { [key: string]: string[] } = {
          'programming': ['Lập trình web với React', 'Phát triển ứng dụng di động với Flutter'],
          'design': ['Thiết kế đồ họa với Adobe Illustrator'],
          'business': ['Quản lý dự án phần mềm'],
          'language': [],
          'marketing': [],
        };
        return courseCategories[category]?.includes(course.title);
      });
    }

    setFilteredCourses(filtered);
  };

  return (
    <div className="min-h-screen pb-12">
      <section className="bg-muted/50 py-12">
        <div className="container">
          <h1 className="heading-xl mb-8 text-center">Khóa học</h1>
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex w-full gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Tìm kiếm khóa học..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit">Tìm kiếm</Button>
            </form>
          </div>
        </div>
      </section>

      <CategoryBar 
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {filteredCourses.length === 0 ? (
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy khóa học</h2>
          <p className="text-muted-foreground mb-8">
            Không có khóa học nào phù hợp với tìm kiếm "{searchTerm}".
          </p>
          <Button onClick={() => {
            setSearchTerm('');
            setSelectedCategory('all');
            setFilteredCourses(allCourses);
          }}>
            Xem tất cả khóa học
          </Button>
        </div>
      ) : (
        <div className="my-8">
          <CourseGrid courses={filteredCourses} />
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
