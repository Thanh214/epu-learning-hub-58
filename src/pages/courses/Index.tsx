import React, { useState, useEffect } from 'react';
import CourseGrid from '@/components/features/courses/CourseGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import CategoryBar from '@/components/features/courses/CategoryBar';
import axios from 'axios';
import { CourseProps } from '@/components/features/courses/CourseCard';
import { toast } from '@/hooks/use-toast';

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [allCourses, setAllCourses] = useState<CourseProps[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy dữ liệu khóa học từ API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/courses');
        
        if (response.data.status === 'success') {
          const coursesData = response.data.data.courses.map((course: any) => ({
            id: course.id,
            title: course.title,
            description: course.description,
            thumbnail: course.thumbnail || 'https://placehold.co/600x400?text=EPU+Learning',
            enrollmentCount: course.enrollment_count || 0,
            chapterCount: course.chapter_count || 0
          }));
          
          setAllCourses(coursesData);
          setFilteredCourses(coursesData);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách khóa học. Vui lòng thử lại sau.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterCourses(searchTerm, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterCourses(searchTerm, category);
  };

  const filterCourses = (search: string, category: string) => {
    let filtered = [...allCourses];

    // Apply search filter
    if (search) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filter
    if (category !== 'all') {
      // Trong một ứng dụng thực tế, bạn sẽ lọc dựa trên dữ liệu danh mục thực tế
      filtered = filtered.filter(course => {
        // Đây là nơi để thêm logic lọc theo danh mục
        return true; // Placeholder cho logic lọc thực tế
      });
    }

    setFilteredCourses(filtered);
  };

  return (
    <div className="min-h-screen pb-12">
      <section className="bg-muted/50 py-12">
        <div className="container">
          <h1 className="text-3xl font-bold mb-8 text-center">Khóa học</h1>
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

      {isLoading ? (
        <div className="container py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy khóa học</h2>
          <p className="text-muted-foreground mb-8">
            {searchTerm ? `Không có khóa học nào phù hợp với tìm kiếm "${searchTerm}".` : 'Chưa có khóa học nào.'}
          </p>
          {searchTerm && (
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setFilteredCourses(allCourses);
            }}>
              Xem tất cả khóa học
            </Button>
          )}
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
