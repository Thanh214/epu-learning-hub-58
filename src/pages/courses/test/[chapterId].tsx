import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useInterval } from '@/hooks/use-interval';

interface Question {
  id: number;
  question_text: string;
  options: {
    key: string;
    text: string;
  }[];
}

interface ExamInfo {
  id: number;
  title: string;
  time_limit: number;
  total_questions: number;
}

interface ExamResult {
  score: number;
  total_questions: number;
  correct_count: number;
  questions: {
    id: number;
    question_text: string;
    options: {
      key: string;
      text: string;
    }[];
    correct_answer: string;
    user_answer?: string;
  }[];
}

const ExamPage = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<'intro' | 'exam' | 'result'>('intro');
  const [exam, setExam] = useState<ExamInfo | null>(null);
  const [examId, setExamId] = useState<number | null>(null);
  const [userExamId, setUserExamId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<{question_id: number, answer: string}[]>([]);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [chapterTitle, setChapterTitle] = useState<string>('');
  
  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để làm bài kiểm tra.",
        variant: "destructive"
      });
      navigate('/auth/login');
      return;
    }
    
    const fetchExamInfo = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/exams/chapter/${chapterId}`);
        
        if (response.data.status === 'success') {
          const examData = response.data.data.exam;
          setExam({
            id: examData.id,
            title: examData.title,
            time_limit: examData.time_limit,
            total_questions: examData.total_questions
          });
          setExamId(examData.id);
          setCourseId(examData.course_id);
          setChapterTitle(examData.chapter_title);
        }
      } catch (error) {
        console.error('Error fetching exam:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin bài kiểm tra. Vui lòng thử lại sau.",
          variant: "destructive"
        });
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExamInfo();
  }, [chapterId, isAuthenticated, authLoading, navigate, toast]);
  
  // Khởi động bài kiểm tra
  const startExam = async () => {
    if (!examId) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/api/exams/start', {
        exam_id: examId
      });
      
      if (response.data.status === 'success') {
        setQuestions(response.data.data.questions);
        setUserExamId(response.data.data.user_exam_id);
        setTimeLeft(response.data.data.exam_info.time_limit * 60); // Chuyển phút thành giây
        setCurrentStep('exam');
      }
    } catch (error) {
      console.error('Error starting exam:', error);
      
      const errorMessage = 
        error.response?.data?.message || 
        "Không thể bắt đầu bài kiểm tra. Vui lòng thử lại sau.";
      
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Xử lý khi người dùng chọn đáp án
  const handleAnswerSelect = (questionId: number, answer: string) => {
    setUserAnswers(prev => {
      // Kiểm tra xem câu hỏi đã được trả lời chưa
      const existingAnswerIndex = prev.findIndex(a => a.question_id === questionId);
      
      if (existingAnswerIndex >= 0) {
        // Nếu câu hỏi đã được trả lời, cập nhật đáp án
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { 
          question_id: questionId, 
          answer 
        };
        return newAnswers;
      } else {
        // Nếu câu hỏi chưa được trả lời, thêm đáp án mới
        return [...prev, { 
          question_id: questionId, 
          answer 
        }];
      }
    });
  };
  
  // Theo dõi thời gian làm bài
  useInterval(() => {
    if (timeLeft !== null && timeLeft > 0 && currentStep === 'exam') {
      setTimeLeft(timeLeft - 1);
    } else if (timeLeft === 0 && currentStep === 'exam') {
      submitExam();
    }
  }, 1000);
  
  // Hiển thị thời gian dạng mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Nộp bài kiểm tra
  const submitExam = async () => {
    if (!userExamId) return;
    
    setIsLoading(true);
    try {
      console.log('Submitting exam with answers:', userAnswers);
      console.log('Total questions:', questions.length);
      console.log('User exam ID:', userExamId);
      
      // Đảm bảo question_id là số
      const formattedAnswers = userAnswers.map(answer => ({
        question_id: Number(answer.question_id),
        answer: answer.answer
      }));
      
      console.log('Formatted answers:', formattedAnswers);
      
      const response = await axios.post('/api/exams/submit', {
        user_exam_id: userExamId,
        answers: formattedAnswers
      });
      
      if (response.data.status === 'success') {
        setExamResult(response.data.data);
        setCurrentStep('result');
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      // Log detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      
      // Show more detailed error message to user
      const errorMessage = error.response?.data?.message || "Không thể nộp bài kiểm tra. Vui lòng thử lại.";
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Quay lại trang khóa học
  const goToCourse = () => {
    if (courseId) {
      navigate(`/courses/${courseId}`);
    } else {
      navigate('/courses');
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="container py-8 max-w-4xl mx-auto min-h-screen">
      {currentStep === 'intro' && exam && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Quay lại
              </button>
              <div className="text-sm text-muted-foreground">Bài kiểm tra</div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{exam.title}</h1>
            <p className="text-muted-foreground mb-6">{chapterTitle}</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <span>Thời gian làm bài: <strong>{exam.time_limit} phút</strong></span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                <span>Số câu hỏi: <strong>{exam.total_questions} câu</strong></span>
              </div>
            </div>
            
            <Alert className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lưu ý</AlertTitle>
              <AlertDescription>
                Sau khi bắt đầu, bạn có {exam.time_limit} phút để hoàn thành bài kiểm tra.
                Bạn không thể tạm dừng hoặc quay lại sau khi đã bắt đầu.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-end">
              <Button onClick={startExam} size="lg">
                Bắt đầu làm bài
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {currentStep === 'exam' && questions.length > 0 && (
        <div className="space-y-6">
          <div className="sticky top-0 bg-background pt-4 pb-2 shadow-sm z-10">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold">{exam?.title}</h1>
              <div className="flex items-center text-lg font-semibold">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                {timeLeft !== null && formatTime(timeLeft)}
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
              <span>Đã trả lời: {userAnswers.length}/{questions.length}</span>
              <span>{Math.floor((userAnswers.length / questions.length) * 100)}% hoàn thành</span>
            </div>
            
            <Progress value={(userAnswers.length / questions.length) * 100} className="mb-4" />
          </div>
          
          <div className="space-y-6 pb-20">
            {questions.map((question, index) => (
              <Card key={question.id} id={`question-${question.id}`} className="relative">
                <CardContent className="p-6">
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="ml-10 mb-6">
                    <h3 className="text-lg font-medium mb-4">
                      {question.question_text}
                    </h3>
                    
                    <div className="space-y-3">
                      {question.options.map((option) => {
                        const isSelected = userAnswers.some(
                          a => a.question_id === question.id && a.answer === option.key
                        );
                        
                        return (
                          <div 
                            key={option.key}
                            className={`
                              p-3 border rounded-md flex items-center cursor-pointer
                              ${isSelected ? 'border-primary bg-primary/10' : 'hover:border-muted-foreground'}
                            `}
                            onClick={() => handleAnswerSelect(question.id, option.key)}
                          >
                            <div className={`
                              w-5 h-5 rounded-full border flex items-center justify-center mr-3
                              ${isSelected ? 'border-primary' : 'border-input'}
                            `}>
                              {isSelected && <div className="w-3 h-3 rounded-full bg-primary" />}
                            </div>
                            <div>
                              <span className="font-medium mr-2">{option.key}.</span>
                              {option.text}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="mr-4">
                  <span className="font-medium">{userAnswers.length}</span>
                  <span className="text-muted-foreground">/{questions.length} câu đã trả lời</span>
                </div>
              </div>
              
              <Button 
                size="lg"
                onClick={submitExam}
                disabled={userAnswers.length < questions.length}
              >
                {userAnswers.length < questions.length 
                  ? `Hãy trả lời hết ${questions.length - userAnswers.length} câu còn lại` 
                  : 'Nộp bài'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {currentStep === 'result' && examResult && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">Kết quả bài kiểm tra</h1>
              <p className="text-muted-foreground">{exam?.title}</p>
            </div>
            
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 rounded-full border-8 border-primary flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">{examResult.score.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Điểm</div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">{examResult.correct_count}</div>
                <div className="text-sm text-muted-foreground">Câu trả lời đúng</div>
              </div>
              
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {examResult.total_questions - examResult.correct_count}
                </div>
                <div className="text-sm text-muted-foreground">Câu trả lời sai</div>
              </div>
            </div>
            
            <h2 className="text-xl font-bold mb-4">Chi tiết bài làm</h2>
            
            <div className="space-y-6 mb-8">
              {examResult.questions.map((question, index) => (
                <Card key={question.id} className={`
                  border-l-4
                  ${question.user_answer === question.correct_answer 
                    ? 'border-l-green-500' 
                    : 'border-l-red-500'}
                `}>
                  <CardContent className="p-4">
                    <div className="flex items-start mb-3">
                      <span className="font-bold mr-2">{index + 1}.</span>
                      <span>{question.question_text}</span>
                    </div>
                    
                    <div className="ml-6 space-y-2">
                      {question.options.map((option) => {
                        const isUserAnswer = option.key === question.user_answer;
                        const isCorrectAnswer = option.key === question.correct_answer;
                        
                        let optionClassName = "py-2 px-3 rounded-md flex items-center";
                        
                        if (isCorrectAnswer) {
                          optionClassName += " bg-green-100 text-green-800";
                        } else if (isUserAnswer) {
                          optionClassName += " bg-red-100 text-red-800";
                        }
                        
                        return (
                          <div key={option.key} className={optionClassName}>
                            {isCorrectAnswer && (
                              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                            )}
                            {!isUserAnswer && !isCorrectAnswer && (
                              <div className="w-5 h-5 mr-2" />
                            )}
                            
                            <div>
                              <span className="font-medium mr-2">{option.key}.</span>
                              {option.text}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center">
              <Button onClick={goToCourse} size="lg">
                Quay lại khóa học
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExamPage; 