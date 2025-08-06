import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({
    subsets: ['latin'],
    weight: '700',
    variable: '--font-dancing-script',
});

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
            {/* Back to Home Link */}
            <Link href="/" className="absolute top-6 left-6 inline-flex items-center text-gray-500 hover:text-teal-600 transition-colors duration-200">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Home
            </Link>

            <div className="w-full max-w-md space-y-8 p-10 bg-white rounded-xl shadow-2xl border border-gray-200">
                <div className="text-center">
                    <h1 className={`${dancingScript.className} text-5xl font-bold text-gray-800`}>
                        Simama
                    </h1>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Create a New Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-teal-600 hover:text-teal-500">
                            Sign in here!
                        </Link>
                    </p>
                </div>

                <RegisterForm />
            </div>
        </div>
    );
}