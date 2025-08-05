import { Inter } from 'next/font/google';
import { LoginForm } from '@/features/auth/components/LoginForm';

const inter = Inter({ subsets: ['latin'] });

export default function LoginPage() {
    return (
        <main className={`flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100 ${inter.className}`}>
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl border border-gray-200">
                <h2 className="text-3xl font-bold text-center text-gray-900">
                    Sign in to your account
                </h2>
                <p className="text-center text-sm text-gray-600">
                    Welcome to Simama!
                </p>
                <LoginForm />
            </div>
        </main>
    );
}