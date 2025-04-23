import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { UserCircle, BookOpen, FileText, BarChart2, Users, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

const AdminPage = () => {
  // State for storing data from API
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalCourses: 0,
    activeCourses: 0,
    completions: 0,
  });
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState({
    statistics: true,
    users: true,
    courses: true,
    examResults: true
  });

  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  const [courseStructure, setCourseStructure] = useState<any>({
    id: 0,
    title: '',
    description: '',
    chapters: []
  });

  // Fetch data from API
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(prev => ({ ...prev, statistics: true }));
        const response = await axios.get('/api/admin/statistics');
        setStatistics(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.",
          variant: "destructive"
        });
      } finally {
        setLoading(prev => ({ ...prev, statistics: false }));
      }
    };

    const fetchUsers = async () => {
      try {
        setLoading(prev => ({ ...prev, users: true }));
        const response = await axios.get('/api/admin/users');
        setUsers(response.data.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu người dùng. Vui lòng thử lại sau.",
          variant: "destructive"
        });
      } finally {
        setLoading(prev => ({ ...prev, users: false }));
      }
    };

    const fetchCourses = async () => {
      try {
        setLoading(prev => ({ ...prev, courses: true }));
        const response = await axios.get('/api/admin/courses');
        setCourses(response.data.courses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu khóa học. Vui lòng thử lại sau.",
          variant: "destructive"
        });
      } finally {
        setLoading(prev => ({ ...prev, courses: false }));
      }
    };

    const fetchExamResults = async () => {
      try {
        setLoading(prev => ({ ...prev, examResults: true }));
        const response = await axios.get('/api/admin/exam-results');
        setExamResults(response.data.examResults || []);
      } catch (error) {
        console.error('Error fetching exam results:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu kết quả bài kiểm tra. Vui lòng thử lại sau.",
          variant: "destructive"
        });
      } finally {
        setLoading(prev => ({ ...prev, examResults: false }));
      }
    };

    const fetchCourseProgress = async () => {
      try {
        const response = await axios.get('/api/admin/course-progress');
        setCourseProgress(response.data.courseProgress || []);
      } catch (error) {
        console.error('Error fetching course progress:', error);
      }
    };

    // Call all fetch functions
    fetchStatistics();
    fetchUsers();
    fetchCourses();
    fetchExamResults();
    fetchCourseProgress();
  }, []);

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

  const handleCourseSubmit = async (data: any) => {
    try {
      const response = await axios.post('/api/admin/courses', data);
    toast({
      title: "Khóa học đã được tạo",
      description: "Khóa học mới đã được tạo thành công.",
    });
    courseForm.reset();
      // Refresh courses data
      const coursesResponse = await axios.get('/api/admin/courses');
      setCourses(coursesResponse.data.courses || []);
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo khóa học. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  };

  const handleChapterSubmit = async (data: any) => {
    try {
      if (!selectedCourse) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn khóa học trước khi thêm chương.",
          variant: "destructive"
        });
        return;
      }
      
      const response = await axios.post(`/api/admin/courses/${selectedCourse.id}/chapters`, {
        ...data,
        course_id: selectedCourse.id
      });
      
    toast({
      title: "Chương học đã được tạo",
      description: "Chương học mới đã được tạo thành công.",
    });
    chapterForm.reset();
      
      // Refresh selected course data
      const courseResponse = await axios.get(`/api/admin/courses/${selectedCourse.id}`);
      setSelectedCourse(courseResponse.data);
    } catch (error) {
      console.error("Error creating chapter:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo chương học. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  };

  const handleLessonSubmit = async (data: any) => {
    try {
      if (!selectedCourse || !selectedChapter) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn khóa học và chương trước khi thêm bài học.",
          variant: "destructive"
        });
        return;
      }
      
      const response = await axios.post(`/api/admin/chapters/${selectedChapter.id}/lessons`, {
        ...data,
        chapter_id: selectedChapter.id
      });
      
    toast({
      title: "Bài học đã được tạo",
      description: "Bài học mới đã được tạo thành công.",
    });
    lessonForm.reset();
      
      // Refresh selected chapter data
      const chapterResponse = await axios.get(`/api/admin/chapters/${selectedChapter.id}`);
      setSelectedChapter(chapterResponse.data);
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo bài học. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  };

  const handlePageSubmit = async (data: any) => {
    try {
      if (!selectedLesson) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn bài học trước khi thêm trang nội dung.",
          variant: "destructive"
        });
        return;
      }
      
      const response = await axios.post(`/api/admin/lessons/${selectedLesson.id}/pages`, {
        ...data,
        lesson_id: selectedLesson.id
      });
      
    toast({
      title: "Trang nội dung đã được tạo",
      description: "Trang nội dung mới đã được tạo thành công.",
    });
    pageForm.reset();
      
      // Refresh selected lesson data
      const lessonResponse = await axios.get(`/api/admin/lessons/${selectedLesson.id}`);
      setSelectedLesson(lessonResponse.data);
    } catch (error) {
      console.error("Error creating page:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo trang nội dung. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
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
                {loading.statistics ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                <div className="text-2xl font-bold">{statistics.totalUsers}</div>
                )}
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
                {loading.statistics ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                <div className="text-2xl font-bold">{statistics.totalCourses}</div>
                )}
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
                {loading.statistics ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                <div className="text-2xl font-bold">{statistics.activeCourses}</div>
                )}
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
                {loading.statistics ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                <div className="text-2xl font-bold">{statistics.completions}</div>
                )}
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
                  {loading.courses ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                  <div className="space-y-6">
                      {courseProgress.length > 0 ? (
                        courseProgress.map((course: any) => (
                          <div key={course.courseId || course.course_id} className="space-y-2">
                        <div className="flex justify-between">
                              <span className="font-medium">{course.courseName || course.course_name}</span>
                              <span>{course.progress || course.progress_percent || 0}%</span>
                        </div>
                            <Progress value={course.progress || course.progress_percent || 0} className="h-2" />
                        <div className="text-sm text-muted-foreground">
                              {course.studentsCount || course.students_count || 0} học viên đăng ký
                        </div>
                      </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          Không có dữ liệu tiến độ khóa học
                  </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Kết quả bài kiểm tra</CardTitle>
                  <CardDescription>Điểm trung bình của người học trong các bài kiểm tra</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading.examResults ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
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
                          {examResults.length > 0 ? (
                            examResults.map((exam: any) => (
                              <TableRow key={exam.examId || exam.exam_id}>
                                <TableCell className="font-medium">{exam.examTitle || exam.exam_title}</TableCell>
                                <TableCell className="text-right">{exam.studentCount || exam.student_count || 0}</TableCell>
                            <TableCell className="text-right">
                                  <span className={`font-medium ${(exam.averageScore || exam.average_score || 0) >= 80 ? 'text-green-600' : (exam.averageScore || exam.average_score || 0) >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                    {exam.averageScore || exam.average_score || 0}/100
                              </span>
                            </TableCell>
                          </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-4">
                                Không có dữ liệu kết quả bài kiểm tra
                              </TableCell>
                            </TableRow>
                          )}
                      </TableBody>
                    </Table>
                  </div>
                  )}
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
                {loading.users ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
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
                        {users.length > 0 ? (
                          users.map((user: any) => (
                        <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.name || user.full_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                              <TableCell>{user.course_count || user.courses || 0}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                            </div>
                          </TableCell>
                              <TableCell>{user.last_active || user.lastActive || 'Không rõ'}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              Không có dữ liệu người dùng
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </div>
                )}
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
                                  <Input placeholder="Đường dẫn hoặc URL ảnh thumbnail" {...field} />
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
                {loading.courses ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
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
                        {courses.length > 0 ? (
                          courses.map((course: any) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.title}</TableCell>
                              <TableCell>{course.enrolled_count || course.enrolledCount || 0}</TableCell>
                              <TableCell>{course.chapters_count || course.chaptersCount || 0}</TableCell>
                              <TableCell>{course.lessons_count || course.lessonsCount || 0}</TableCell>
                              <TableCell>{course.created_at || course.createdAt || 'Không rõ'}</TableCell>
                              <TableCell>{course.updated_at || course.updatedAt || 'Không rõ'}</TableCell>
                          <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                          </TableCell>
                        </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                              Không có dữ liệu khóa học
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </div>
                )}
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
