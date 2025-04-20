
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { UserCircle, BookOpen, FileText, BarChart2, Users, Edit, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

// Sample statistics data
const statistics = {
  totalUsers: 124,
  totalCourses: 15,
  activeCourses: 12,
  completions: 87,
};

// Sample users data
const users = [
  { id: 1, name: 'Nguyễn Văn A', email: 'vana@example.com', courses: 3, status: 'active', lastActive: '2 giờ trước' },
  { id: 2, name: 'Trần Thị B', email: 'thib@example.com', courses: 2, status: 'active', lastActive: '1 ngày trước' },
  { id: 3, name: 'Lê Văn C', email: 'vanc@example.com', courses: 1, status: 'inactive', lastActive: '1 tuần trước' },
  { id: 4, name: 'Phạm Thị D', email: 'thid@example.com', courses: 4, status: 'active', lastActive: '3 giờ trước' },
];

// Sample courses data
const courses = [
  { 
    id: 1, 
    title: 'Lập trình web với React', 
    enrolledCount: 48, 
    chaptersCount: 6, 
    lessonsCount: 24,
    createdAt: '05/01/2025',
    updatedAt: '20/03/2025'
  },
  { 
    id: 2, 
    title: 'Cơ sở dữ liệu SQL', 
    enrolledCount: 32, 
    chaptersCount: 5, 
    lessonsCount: 18,
    createdAt: '10/02/2025',
    updatedAt: '15/03/2025'
  },
  { 
    id: 3, 
    title: 'Lập trình Java cơ bản', 
    enrolledCount: 56, 
    chaptersCount: 8, 
    lessonsCount: 32,
    createdAt: '15/12/2024',
    updatedAt: '05/04/2025'
  },
];

// Sample course progress data
const courseProgress = [
  { courseId: 1, courseName: 'Lập trình web với React', progress: 65, studentsCount: 48 },
  { courseId: 2, courseName: 'Cơ sở dữ liệu SQL', progress: 42, studentsCount: 32 },
  { courseId: 3, courseName: 'Lập trình Java cơ bản', progress: 78, studentsCount: 56 },
];

// Sample exam results data
const examResults = [
  { 
    examId: 1, 
    examTitle: 'React Hooks', 
    courseTitle: 'Lập trình web với React',
    studentCount: 32, 
    averageScore: 76, 
    highScore: 98, 
    lowScore: 45 
  },
  { 
    examId: 2, 
    examTitle: 'SQL Joins', 
    courseTitle: 'Cơ sở dữ liệu SQL',
    studentCount: 28, 
    averageScore: 82, 
    highScore: 100, 
    lowScore: 56 
  },
];

// Sample course structure for editing course content
const courseStructure = {
  id: 1,
  title: 'Lập trình web với React',
  description: 'Khóa học toàn diện về ReactJS và các công nghệ liên quan.',
  chapters: [
    {
      id: 1,
      title: 'Giới thiệu React',
      lessons: [
        { id: 1, title: 'Giới thiệu khóa học' },
        { id: 2, title: 'Thiết lập môi trường' },
      ]
    },
    {
      id: 2,
      title: 'React Components',
      lessons: [
        { id: 3, title: 'Function Components' },
        { id: 4, title: 'Class Components' },
      ]
    }
  ]
};

const AdminPage = () => {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  // Forms
  const courseForm = useForm({
    defaultValues: {
      title: '',
      description: '',
      thumbnail: '',
    }
  });

  const chapterForm = useForm({
    defaultValues: {
      title: '',
      orderNumber: 1,
    }
  });

  const lessonForm = useForm({
    defaultValues: {
      title: '',
      orderNumber: 1,
    }
  });

  const pageForm = useForm({
    defaultValues: {
      content: '',
      pageType: 'text'
    }
  });

  // Course Content Management
  const handleCourseSelection = (course: any) => {
    setSelectedCourse(course);
    setSelectedChapter(null);
    setSelectedLesson(null);
  };

  const handleChapterSelection = (chapter: any) => {
    setSelectedChapter(chapter);
    setSelectedLesson(null);
  };

  const handleLessonSelection = (lesson: any) => {
    setSelectedLesson(lesson);
  };

  const handleCourseSubmit = (data: any) => {
    console.log("Create new course:", data);
    toast({
      title: "Khóa học đã được tạo",
      description: "Khóa học mới đã được tạo thành công.",
    });
    courseForm.reset();
  };

  const handleChapterSubmit = (data: any) => {
    console.log("Create new chapter:", data);
    toast({
      title: "Chương học đã được tạo",
      description: "Chương học mới đã được tạo thành công.",
    });
    chapterForm.reset();
  };

  const handleLessonSubmit = (data: any) => {
    console.log("Create new lesson:", data);
    toast({
      title: "Bài học đã được tạo",
      description: "Bài học mới đã được tạo thành công.",
    });
    lessonForm.reset();
  };

  const handlePageSubmit = (data: any) => {
    console.log("Create new page:", data);
    toast({
      title: "Trang nội dung đã được tạo",
      description: "Trang nội dung mới đã được tạo thành công.",
    });
    pageForm.reset();
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <div className="bg-background py-6 border-b">
        <div className="container">
          <h1 className="text-3xl font-bold">Quản trị hệ thống</h1>
          <p className="text-muted-foreground mt-1">Quản lý người dùng, khóa học và nội dung học tập</p>
        </div>
      </div>
      
      <div className="container py-8">
        {/* Statistics Cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số người dùng</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{statistics.totalUsers}</div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Khóa học</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{statistics.totalCourses}</div>
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Khóa học hoạt động</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{statistics.activeCourses}</div>
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Số lượt hoàn thành</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{statistics.completions}</div>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="users">Người dùng</TabsTrigger>
            <TabsTrigger value="courses">Khóa học</TabsTrigger>
            <TabsTrigger value="content">Quản lý nội dung</TabsTrigger>
            <TabsTrigger value="exams">Bài kiểm tra</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tiến độ khóa học</CardTitle>
                  <CardDescription>Tiến độ trung bình của người học trong các khóa học</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {courseProgress.map((course) => (
                      <div key={course.courseId} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{course.courseName}</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <div className="text-sm text-muted-foreground">
                          {course.studentsCount} học viên đăng ký
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Kết quả bài kiểm tra</CardTitle>
                  <CardDescription>Điểm trung bình của người học trong các bài kiểm tra</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Bài kiểm tra</TableHead>
                          <TableHead className="text-right">Số lượng</TableHead>
                          <TableHead className="text-right">Điểm TB</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {examResults.map((exam) => (
                          <TableRow key={exam.examId}>
                            <TableCell className="font-medium">{exam.examTitle}</TableCell>
                            <TableCell className="text-right">{exam.studentCount}</TableCell>
                            <TableCell className="text-right">
                              <span className={`font-medium ${exam.averageScore >= 80 ? 'text-green-600' : exam.averageScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                {exam.averageScore}/100
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Người dùng</CardTitle>
                  <CardDescription>Quản lý tài khoản người dùng trong hệ thống</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input placeholder="Tìm kiếm người dùng..." className="w-64" />
                  <Button>Tìm kiếm</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên người dùng</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Khóa học</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Hoạt động gần nhất</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.courses}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                            </div>
                          </TableCell>
                          <TableCell>{user.lastActive}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <div className="text-sm text-muted-foreground">
                  Hiển thị 1-{users.length} trên {statistics.totalUsers} người dùng
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>Trước</Button>
                  <Button variant="outline" size="sm">Sau</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Courses Tab */}
          <TabsContent value="courses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Khóa học</CardTitle>
                  <CardDescription>Quản lý tất cả các khóa học trong hệ thống</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input placeholder="Tìm kiếm khóa học..." className="w-64" />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Thêm khóa học</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Thêm khóa học mới</DialogTitle>
                        <DialogDescription>
                          Điền thông tin để tạo khóa học mới trong hệ thống
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...courseForm}>
                        <form onSubmit={courseForm.handleSubmit(handleCourseSubmit)} className="space-y-4">
                          <FormField
                            control={courseForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tiêu đề khóa học</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nhập tiêu đề khóa học" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={courseForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mô tả</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nhập mô tả khóa học" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={courseForm.control}
                            name="thumbnail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ảnh thumbnail</FormLabel>
                                <FormControl>
                                  <Input type="file" className="cursor-pointer" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button type="submit">Tạo khóa học</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tiêu đề khóa học</TableHead>
                        <TableHead>Học viên</TableHead>
                        <TableHead>Chương</TableHead>
                        <TableHead>Bài học</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Cập nhật</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.title}</TableCell>
                          <TableCell>{course.enrolledCount}</TableCell>
                          <TableCell>{course.chaptersCount}</TableCell>
                          <TableCell>{course.lessonsCount}</TableCell>
                          <TableCell>{course.createdAt}</TableCell>
                          <TableCell>{course.updatedAt}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Content Management Tab */}
          <TabsContent value="content">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Course List */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Danh sách khóa học</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {courses.map((course) => (
                      <Button 
                        key={course.id}
                        variant={selectedCourse?.id === course.id ? "default" : "ghost"} 
                        className="w-full justify-start font-normal h-auto py-3 px-4"
                        onClick={() => handleCourseSelection(course)}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        {course.title}
                      </Button>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="sm">
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Thêm khóa học
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Thêm khóa học mới</DialogTitle>
                      </DialogHeader>
                      <Form {...courseForm}>
                        <form onSubmit={courseForm.handleSubmit(handleCourseSubmit)} className="space-y-4">
                          <FormField
                            control={courseForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tiêu đề khóa học</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={courseForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mô tả</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button type="submit">Tạo khóa học</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>

              {/* Course Structure */}
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>{selectedCourse ? selectedCourse.title : 'Nội dung khóa học'}</CardTitle>
                  <CardDescription>
                    {selectedCourse 
                      ? `Quản lý nội dung cho khóa học ${selectedCourse.title}`
                      : 'Chọn khóa học để quản lý nội dung'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedCourse ? (
                    <div className="space-y-6">
                      {/* Sample course structure */}
                      <div className="border rounded-md">
                        {courseStructure.chapters.map((chapter, index) => (
                          <div key={chapter.id} className="border-b last:border-b-0">
                            <div 
                              className={`p-4 flex justify-between items-center cursor-pointer ${selectedChapter?.id === chapter.id ? 'bg-muted' : ''}`}
                              onClick={() => handleChapterSelection(chapter)}
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-medium">Chương {index + 1}: {chapter.title}</span>
                                <span className="text-sm text-muted-foreground">
                                  ({chapter.lessons.length} bài học)
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {selectedChapter?.id === chapter.id && (
                              <div className="p-4 bg-background border-t">
                                <div className="space-y-2">
                                  {chapter.lessons.map((lesson, lessonIndex) => (
                                    <div 
                                      key={lesson.id}
                                      className={`p-3 rounded-md flex justify-between items-center ${selectedLesson?.id === lesson.id ? 'bg-muted' : ''}`}
                                      onClick={() => handleLessonSelection(lesson)}
                                    >
                                      <div className="flex items-center gap-3">
                                        <span>{lessonIndex + 1}. {lesson.title}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon">
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button className="w-full mt-3" size="sm">
                                      <Plus className="h-3.5 w-3.5 mr-1" />
                                      Thêm bài học
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Thêm bài học mới</DialogTitle>
                                    </DialogHeader>
                                    <Form {...lessonForm}>
                                      <form onSubmit={lessonForm.handleSubmit(handleLessonSubmit)} className="space-y-4">
                                        <FormField
                                          control={lessonForm.control}
                                          name="title"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Tiêu đề bài học</FormLabel>
                                              <FormControl>
                                                <Input {...field} />
                                              </FormControl>
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={lessonForm.control}
                                          name="orderNumber"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Thứ tự</FormLabel>
                                              <FormControl>
                                                <Input type="number" min={1} {...field} />
                                              </FormControl>
                                            </FormItem>
                                          )}
                                        />
                                        <DialogFooter>
                                          <Button type="submit">Tạo bài học</Button>
                                        </DialogFooter>
                                      </form>
                                    </Form>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm chương mới
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Thêm chương mới</DialogTitle>
                          </DialogHeader>
                          <Form {...chapterForm}>
                            <form onSubmit={chapterForm.handleSubmit(handleChapterSubmit)} className="space-y-4">
                              <FormField
                                control={chapterForm.control}
                                name="title"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tiêu đề chương</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={chapterForm.control}
                                name="orderNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Thứ tự</FormLabel>
                                    <FormControl>
                                      <Input type="number" min={1} {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <DialogFooter>
                                <Button type="submit">Tạo chương</Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">Chưa chọn khóa học</h3>
                      <p className="text-muted-foreground">
                        Chọn một khóa học từ danh sách bên trái để quản lý nội dung
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Exams Tab */}
          <TabsContent value="exams">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Bài kiểm tra</CardTitle>
                  <CardDescription>
                    Quản lý bài kiểm tra và kết quả
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo bài kiểm tra
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tiêu đề</TableHead>
                        <TableHead>Khóa học</TableHead>
                        <TableHead className="text-right">Số học viên</TableHead>
                        <TableHead className="text-right">Điểm trung bình</TableHead>
                        <TableHead className="text-right">Cao nhất</TableHead>
                        <TableHead className="text-right">Thấp nhất</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {examResults.map((exam) => (
                        <TableRow key={exam.examId}>
                          <TableCell className="font-medium">{exam.examTitle}</TableCell>
                          <TableCell>{exam.courseTitle}</TableCell>
                          <TableCell className="text-right">{exam.studentCount}</TableCell>
                          <TableCell className="text-right">
                            <span className={`font-medium ${exam.averageScore >= 80 ? 'text-green-600' : exam.averageScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                              {exam.averageScore}/100
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{exam.highScore}/100</TableCell>
                          <TableCell className="text-right">{exam.lowScore}/100</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
