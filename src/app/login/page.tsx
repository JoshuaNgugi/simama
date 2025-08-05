import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md border border-gray-200">
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