
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, FileText, UserCircle, Lock, Edit } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

// Sample user data - would come from API/backend in a real application
const userData = {
  id: 1,
  fullName: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
  joinedDate: '10/05/2023',
};

// Sample enrolled courses data
const enrolledCourses = [
  {
    id: 1,
    title: 'Lập trình web với React',
    progress: 65,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    updatedAt: '2 ngày trước'
  },
  {
    id: 2,
    title: 'Cơ sở dữ liệu SQL',
    progress: 32,
    thumbnail: 'https://images.unsplash.com/photo-1654278767692-3e5ea2eee5ed',
    updatedAt: '1 tuần trước'
  },
];

// Sample exam results data
const examResults = [
  {
    id: 1,
    examTitle: 'Kiểm tra React Hooks',
    courseTitle: 'Lập trình web với React',
    score: 85,
    date: '15/03/2025',
  },
  {
    id: 2,
    examTitle: 'Kiểm tra SQL cơ bản',
    courseTitle: 'Cơ sở dữ liệu SQL',
    score: 78,
    date: '10/04/2025',
  },
];

// Sample certificates data
const certificates = [
  {
    id: 1,
    title: 'JavaScript cơ bản',
    issuedAt: '10/01/2023',
  },
];

const ProfilePage = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const profileForm = useForm({
    defaultValues: {
      fullName: userData.fullName,
      email: userData.email,
    }
  });

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

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

  const handleProfileSubmit = (data: {fullName: string, email: string}) => {
    // In a real app, would send data to API
    console.log("Profile data to update:", data);
    
    // Upload avatar if changed
    if (avatarFile) {
      console.log("Uploading avatar:", avatarFile);
      // Would handle file upload to server here
    }

    toast({
      title: "Hồ sơ đã được cập nhật",
      description: "Thông tin cá nhân của bạn đã được lưu thành công.",
    });
    setIsEditingProfile(false);
  };

  const handlePasswordSubmit = (data: {currentPassword: string, newPassword: string, confirmPassword: string}) => {
    // In a real app, would send data to API
    console.log("Password data to update:", data);
    
    toast({
      title: "Mật khẩu đã được cập nhật",
      description: "Mật khẩu của bạn đã được thay đổi thành công.",
    });
    setIsChangingPassword(false);
    passwordForm.reset();
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
                        <AvatarImage src={userData.avatar} alt={userData.fullName} />
                        <AvatarFallback>{userData.fullName.charAt(0)}</AvatarFallback>
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
                          <div className="text-base mt-1">{userData.fullName}</div>
                        </div>
                        <div>
                          <Label>Email</Label>
                          <div className="text-base mt-1">{userData.email}</div>
                        </div>
                        <div>
                          <Label>Ngày tham gia</Label>
                          <div className="text-base mt-1">{userData.joinedDate}</div>
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
                            <AvatarImage src={avatarPreview || userData.avatar} alt={userData.fullName} />
                            <AvatarFallback>{userData.fullName.charAt(0)}</AvatarFallback>
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
              <CardContent>
                {!isChangingPassword ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Mật khẩu</span>
                    </div>
                    <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
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
                              <Input type="password" placeholder="Xác nhận mật khẩu mới" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2">
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
                  Danh sách các khóa học bạn đã đăng ký
                </CardDescription>
              </CardHeader>
              <CardContent>
                {enrolledCourses.length > 0 ? (
                  <div className="space-y-6">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="flex flex-col md:flex-row gap-4 pb-6 border-b last:border-0">
                        <div className="w-full md:w-48 h-32 bg-muted rounded-md overflow-hidden">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-3">
                          <h3 className="font-semibold text-lg">{course.title}</h3>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Tiến độ:</span>
                              <span className="font-medium">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Cập nhật {course.updatedAt}</span>
                            <Button>Tiếp tục học</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-1">Chưa có khóa học nào</h3>
                    <p className="text-muted-foreground mb-4">Bạn chưa đăng ký khóa học nào</p>
                    <Button>Khám phá khóa học</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exam Results tab */}
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Kết quả học tập</CardTitle>
                <CardDescription>
                  Kết quả bài kiểm tra và bài tập của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                {examResults.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Bài kiểm tra</TableHead>
                          <TableHead>Khóa học</TableHead>
                          <TableHead className="text-right">Điểm</TableHead>
                          <TableHead className="text-right">Ngày</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {examResults.map((result) => (
                          <TableRow key={result.id}>
                            <TableCell className="font-medium">{result.examTitle}</TableCell>
                            <TableCell>{result.courseTitle}</TableCell>
                            <TableCell className="text-right">
                              <span className={`font-medium ${result.score >= 80 ? 'text-green-600' : result.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                {result.score}/100
                              </span>
                            </TableCell>
                            <TableCell className="text-right">{result.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-1">Chưa có kết quả nào</h3>
                    <p className="text-muted-foreground">Bạn chưa hoàn thành bài kiểm tra nào</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates tab */}
          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle>Chứng chỉ của tôi</CardTitle>
                <CardDescription>
                  Chứng chỉ bạn đã đạt được từ các khóa học
                </CardDescription>
              </CardHeader>
              <CardContent>
                {certificates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                      <Card key={cert.id} className="overflow-hidden">
                        <div className="aspect-[3/2] border-b bg-muted flex items-center justify-center">
                          <BookOpen className="h-24 w-24 text-primary" />
                        </div>
                        <CardHeader>
                          <CardTitle>{cert.title}</CardTitle>
                          <CardDescription>Cấp ngày: {cert.issuedAt}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <Button variant="outline" className="w-full">Xem chứng chỉ</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-1">Chưa có chứng chỉ nào</h3>
                    <p className="text-muted-foreground mb-4">Hoàn thành khóa học để nhận chứng chỉ</p>
                    <Button>Khám phá khóa học</Button>
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
