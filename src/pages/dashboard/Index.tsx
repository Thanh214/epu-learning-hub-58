
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, BarChart2, Award, FileText, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample enrolled courses data
const enrolledCourses = [
  {
    id: 1,
    title: 'Lập trình web với React',
    progress: 65,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    lastLesson: 'useState và useEffect',
    updatedAt: '2 ngày trước'
  },
  {
    id: 2,
    title: 'Cơ sở dữ liệu SQL',
    progress: 32,
    thumbnail: 'https://images.unsplash.com/photo-1654278767692-3e5ea2eee5ed',
    lastLesson: 'Truy vấn JOIN trong SQL',
    updatedAt: '1 tuần trước'
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

// Sample upcoming exams data
const upcomingExams = [
  {
    id: 1,
    title: 'React Hooks',
    courseTitle: 'Lập trình web với React',
    date: '25/04/2025',
    timeLimit: 45,
    questionsCount: 20
  }
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <div className="bg-background py-6 border-b">
        <div className="container">
          <h1 className="text-3xl font-bold">Xin chào, Học Viên</h1>
          <p className="text-muted-foreground mt-1">Chào mừng quay trở lại với Học liệu EPU</p>
        </div>
      </div>
      
      <div className="container py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Khóa học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">2</div>
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Đang tham gia</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tiến độ trung bình</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">48%</div>
                <BarChart2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Trên tất cả khóa học</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bài tập đã nộp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">12</div>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Trên tất cả khóa học</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Chứng chỉ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">1</div>
                <Award className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Đã nhận</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">Khóa học của tôi</TabsTrigger>
            <TabsTrigger value="exams">Bài kiểm tra</TabsTrigger>
            <TabsTrigger value="certificates">Chứng chỉ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Khóa học đã đăng ký</h2>
              {enrolledCourses.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {enrolledCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="flex h-full">
                        <div className="w-1/3 bg-muted">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="w-2/3 p-4 flex flex-col">
                          <div className="flex-grow">
                            <h3 className="font-semibold mb-1">{course.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <span>Tiến độ: {course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2 mb-3" />
                            <div className="text-xs text-muted-foreground mb-3">
                              <p>Bài học gần nhất: {course.lastLesson}</p>
                              <p>Cập nhật: {course.updatedAt}</p>
                            </div>
                          </div>
                          <div>
                            <Link to={`/courses/${course.id}`}>
                              <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                                Tiếp tục học
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <h3 className="font-medium mb-2">Bạn chưa đăng ký khóa học nào</h3>
                    <p className="text-muted-foreground mb-4">Khám phá các khóa học của chúng tôi và bắt đầu hành trình học tập của bạn</p>
                    <Link to="/courses">
                      <Button>Khám phá khóa học</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Khóa học đề xuất</h2>
                <Link to="/courses" className="text-primary text-sm font-medium hover:underline">
                  Xem tất cả
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="overflow-hidden">
                  <div className="flex h-full">
                    <div className="w-1/3 bg-muted">
                      <img 
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c" 
                        alt="Quản lý dự án phần mềm" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4 flex flex-col">
                      <div className="flex-grow">
                        <h3 className="font-semibold mb-1">Quản lý dự án phần mềm</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          Học các phương pháp và kỹ thuật quản lý dự án phần mềm hiệu quả.
                        </p>
                      </div>
                      <Link to="/courses/6">
                        <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                          Xem chi tiết
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
                
                <Card className="overflow-hidden">
                  <div className="flex h-full">
                    <div className="w-1/3 bg-muted">
                      <img 
                        src="https://images.unsplash.com/photo-1563013544-824ae1b704d3" 
                        alt="An toàn và bảo mật thông tin" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4 flex flex-col">
                      <div className="flex-grow">
                        <h3 className="font-semibold mb-1">An toàn và bảo mật thông tin</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          Học cách bảo vệ hệ thống thông tin khỏi các mối đe dọa và tấn công mạng.
                        </p>
                      </div>
                      <Link to="/courses/8">
                        <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                          Xem chi tiết
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="exams" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Bài kiểm tra sắp tới</h2>
              {upcomingExams.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {upcomingExams.map((exam) => (
                    <Card key={exam.id}>
                      <CardHeader>
                        <CardTitle>{exam.title}</CardTitle>
                        <CardDescription>{exam.courseTitle}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ngày thi:</span>
                            <span>{exam.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Thời gian làm bài:</span>
                            <span>{exam.timeLimit} phút</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Số câu hỏi:</span>
                            <span>{exam.questionsCount}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">Xem chi tiết</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <h3 className="font-medium mb-2">Không có bài kiểm tra nào sắp tới</h3>
                    <p className="text-muted-foreground">
                      Hiện tại không có bài kiểm tra nào được lên lịch cho các khóa học của bạn
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4">Kết quả bài kiểm tra gần đây</h2>
              <Card>
                <CardContent className="py-8 text-center">
                  <h3 className="font-medium mb-2">Không có kết quả bài kiểm tra nào</h3>
                  <p className="text-muted-foreground">
                    Bạn chưa tham gia bài kiểm tra nào gần đây
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="certificates" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Chứng chỉ của tôi</h2>
              {certificates.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {certificates.map((cert) => (
                    <Card key={cert.id} className="overflow-hidden">
                      <div className="aspect-[3/2] border-b bg-muted flex items-center justify-center">
                        <Award className="h-24 w-24 text-primary" />
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
                <Card>
                  <CardContent className="py-8 text-center">
                    <h3 className="font-medium mb-2">Bạn chưa có chứng chỉ nào</h3>
                    <p className="text-muted-foreground mb-4">
                      Hoàn thành các khóa học để nhận chứng chỉ
                    </p>
                    <Link to="/courses">
                      <Button>Khám phá khóa học</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
