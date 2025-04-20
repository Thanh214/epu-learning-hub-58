
import React from 'react';
import CourseGrid from '@/components/features/courses/CourseGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import CategoryBar from '@/components/features/courses/CategoryBar';

// Empty course data array
const allCourses = [];

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
      filtered = filtered.filter(course => {
        // This would be replaced with actual category data from backend
        return true; // Placeholder for actual filtering logic
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
