
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Implement actual login logic here
      console.log('Login attempt:', { email, password });
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Đăng nhập thành công!",
        description: "Đang chuyển hướng đến trang dashboard...",
      });
      
      // In a real app, you would redirect to dashboard or home page here
    } catch (error) {
      toast({
        title: "Đăng nhập thất bại",
        description: "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
        <CardDescription className="text-center">
          Nhập thông tin đăng nhập của bạn để tiếp tục
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mật khẩu</Label>
              <Link 
                to="/auth/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
          
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{' '}
            <Link
              to="/auth/register"
              className="font-medium text-primary hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
