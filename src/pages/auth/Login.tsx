
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '@/components/features/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-muted/50 py-12 flex items-center justify-center">
      <div className="container max-w-md">
        <Link to="/" className="flex items-center justify-center gap-1 mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <span className="font-bold text-xl">Học liệu EPU</span>
        </Link>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
