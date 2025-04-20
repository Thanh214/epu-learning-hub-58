import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, FileText, UserCircle, Lock, Edit, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// Interfaces cho dữ liệu
interface EnrolledCourse {
  id: number;
  course_id: number;
  title: string;
  progress_percent: number;
  thumbnail: string;
  updatedAt: string;
}

interface ExamResult {
  id: number;
  exam_id: number;
  exam_title: string;
  course_title: string;
  score: number;
  completed_at: string;
}

interface Certificate {
  id: number;
  course_id: number;
  title: string;
  issued_at: string;
  certificate_url: string;
}

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    courses: false,
    exams: false,
    certificates: false
  });
  
  // State cho dữ liệu từ API
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Chuyển hướng nếu chưa đăng nhập
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Form cho chỉnh sửa hồ sơ
  const profileForm = useForm({
    defaultValues: {
      fullName: '',
      email: '',
    }
  });
  
  // Cập nhật giá trị form khi user được tải
  useEffect(() => {
    if (user) {
      profileForm.reset({
        fullName: user.full_name,
        email: user.email
      });
    }
  }, [user, profileForm]);

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  // Tải dữ liệu khóa học đã đăng ký
  const fetchEnrolledCourses = async () => {
    if (!user) return;
    
    try {
      setLoading(prev => ({ ...prev, courses: true }));
      const response = await axios.get('/api/user/enrolled-courses');
      setEnrolledCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      // Trong trường hợp lỗi, có thể hiển thị dữ liệu mẫu để demo
      setEnrolledCourses([]);
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  };

  // Tải dữ liệu kết quả bài kiểm tra
  const fetchExamResults = async () => {
    if (!user) return;
    
    try {
      setLoading(prev => ({ ...prev, exams: true }));
      const response = await axios.get('/api/user/exam-results');
      setExamResults(response.data.exams || []);
    } catch (error) {
      console.error('Error fetching exam results:', error);
      setExamResults([]);
    } finally {
      setLoading(prev => ({ ...prev, exams: false }));
    }
  };

  // Tải dữ liệu chứng chỉ
  const fetchCertificates = async () => {
    if (!user) return;
    
    try {
      setLoading(prev => ({ ...prev, certificates: true }));
      const response = await axios.get('/api/user/certificates');
      setCertificates(response.data.certificates || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setCertificates([]);
    } finally {
      setLoading(prev => ({ ...prev, certificates: false }));
    }
  };

  // Tải dữ liệu khi component được render và user đã đăng nhập
  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
      fetchExamResults();
      fetchCertificates();
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (data: {fullName: string, email: string}) => {
    try {
      // Gửi request cập nhật thông tin cá nhân
      const response = await axios.put('/api/auth/me', {
        full_name: data.fullName,
        email: data.email
      });
      
      // Upload avatar nếu có thay đổi
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        await axios.post('/api/auth/upload-avatar', formData);
      }

      toast({
        title: "Hồ sơ đã được cập nhật",
        description: "Thông tin cá nhân của bạn đã được lưu thành công.",
      });
      
      // Cập nhật user context nếu cần
      // updateUser(response.data.user);
      
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Lỗi cập nhật",
        description: "Không thể cập nhật thông tin. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  };

  const handlePasswordSubmit = async (data: {currentPassword: string, newPassword: string, confirmPassword: string}) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast({
          title: "Lỗi",
          description: "Mật khẩu mới và xác nhận mật khẩu không khớp",
          variant: "destructive"
        });
        return;
      }
      
      // Gửi request đổi mật khẩu với phương thức POST thay vì PUT
      await axios.post('/api/auth/change-password', {
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });
      
      toast({
        title: "Mật khẩu đã được cập nhật",
        description: "Mật khẩu của bạn đã được thay đổi thành công.",
      });
      
      setIsChangingPassword(false);
      passwordForm.reset();
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Lỗi đổi mật khẩu",
        description: "Không thể đổi mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại của bạn.",
        variant: "destructive"
      });
    }
  };

  // Hiển thị loader khi đang tải
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Chắc chắn user đã tồn tại
  if (!user) {
    return null;
  }

  // Format ngày tham gia
  const formattedJoinDate = user && user.created_at 
    ? new Date(user.created_at).toLocaleDateString('vi-VN') 
    : new Date().toLocaleDateString('vi-VN');

  // Lấy chữ cái đầu từ tên người dùng
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <div className="bg-background py-6 border-b">
        <div className="container">
          <h1 className="text-3xl font-bold">Tài khoản cá nhân</h1>
          <p className="text-muted-foreground mt-1">Quản lý thông tin cá nhân và tiến trình học tập</p>
        </div>
      </div>

      <div className="container py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
            <TabsTrigger value="courses">Khóa học của tôi</TabsTrigger>
            <TabsTrigger value="results">Kết quả học tập</TabsTrigger>
            <TabsTrigger value="certificates">Chứng chỉ</TabsTrigger>
          </TabsList>

          {/* Profile tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Quản lý thông tin cá nhân và tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isEditingProfile ? (
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-32 w-32">
                        <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                      </Avatar>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => setIsEditingProfile(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </Button>
                    </div>
                    <div className="space-y-4 flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Họ và tên</Label>
                          <div className="text-base mt-1">{user.full_name}</div>
                        </div>
                        <div>
                          <Label>Email</Label>
                          <div className="text-base mt-1">{user.email}</div>
                        </div>
                        <div>
                          <Label>Ngày tham gia</Label>
                          <div className="text-base mt-1">{formattedJoinDate}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex flex-col items-center">
                          <Avatar className="h-32 w-32">
                            <AvatarImage src={avatarPreview || undefined} alt={user.full_name} />
                            <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                          </Avatar>
                          <div className="mt-4">
                            <Label htmlFor="avatar" className="cursor-pointer">
                              <div className="flex items-center justify-center gap-2 text-sm border rounded-md px-3 py-1.5 bg-background hover:bg-muted">
                                <UserCircle className="h-4 w-4" />
                                Thay đổi ảnh
                              </div>
                            </Label>
                            <Input 
                              id="avatar" 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleAvatarChange}
                            />
                          </div>
                        </div>
                        <div className="space-y-4 flex-1">
                          <FormField
                            control={profileForm.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Họ và tên</FormLabel>
                                <FormControl>
                                  <Input placeholder="Họ và tên" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>
                              Hủy
                            </Button>
                            <Button type="submit">
                              Lưu thay đổi
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bảo mật</CardTitle>
                <CardDescription>
                  Quản lý mật khẩu và bảo mật tài khoản
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isChangingPassword ? (
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Mật khẩu</h3>
                      <p className="text-sm text-muted-foreground">••••••••</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsChangingPassword(true)}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Đổi mật khẩu
                    </Button>
                  </div>
                ) : (
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mật khẩu hiện tại</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Nhập mật khẩu hiện tại" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mật khẩu mới</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Nhập mật khẩu mới" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Nhập lại mật khẩu mới" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsChangingPassword(false)}>
                          Hủy
                        </Button>
                        <Button type="submit">
                          Cập nhật mật khẩu
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses tab */}
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Khóa học của tôi</CardTitle>
                <CardDescription>
                  Danh sách các khóa học bạn đã đăng ký và tiến trình học tập
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading.courses ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : enrolledCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="border rounded-lg overflow-hidden">
                        <div className="h-40 bg-muted flex items-center justify-center">
                          {course.thumbnail ? (
                            <img 
                              src={course.thumbnail} 
                              alt={course.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BookOpen className="h-12 w-12 text-muted-foreground" />
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium">{course.title}</h3>
                          <div className="mt-2 space-y-2">
                            <div className="text-sm text-muted-foreground flex justify-between">
                              <span>Tiến trình</span>
                              <span>{course.progress_percent}%</span>
                            </div>
                            <Progress value={course.progress_percent} className="h-2" />
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              Cập nhật: {course.updatedAt}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/courses/${course.course_id}`)}
                            >
                              Tiếp tục học
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Bạn chưa đăng ký khóa học nào</h3>
                    <p className="mt-2 text-muted-foreground">
                      Hãy khám phá các khóa học của chúng tôi để bắt đầu hành trình học tập
                    </p>
                    <Button 
                      className="mt-4"
                      onClick={() => navigate('/courses')}
                    >
                      Khám phá khóa học
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exam results tab */}
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Kết quả học tập</CardTitle>
                <CardDescription>
                  Kết quả các bài kiểm tra bạn đã hoàn thành
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading.exams ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : examResults.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên bài kiểm tra</TableHead>
                        <TableHead>Khóa học</TableHead>
                        <TableHead>Điểm số</TableHead>
                        <TableHead>Ngày hoàn thành</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {examResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">{result.exam_title}</TableCell>
                          <TableCell>{result.course_title}</TableCell>
                          <TableCell>{result.score}/100</TableCell>
                          <TableCell>{result.completed_at}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Chưa có kết quả nào</h3>
                    <p className="mt-2 text-muted-foreground">
                      Hoàn thành các bài kiểm tra trong khóa học để xem kết quả ở đây
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates tab */}
          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle>Chứng chỉ</CardTitle>
                <CardDescription>
                  Các chứng chỉ bạn đã đạt được khi hoàn thành khóa học
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading.certificates ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : certificates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{cert.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Cấp ngày: {cert.issued_at}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" className="shrink-0">
                            Xem chứng chỉ
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Chưa có chứng chỉ nào</h3>
                    <p className="mt-2 text-muted-foreground">
                      Hoàn thành các khóa học để nhận chứng chỉ
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
