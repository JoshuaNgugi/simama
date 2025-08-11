'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import Cookies from 'js-cookie';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { AxiosError } from 'axios';

// Define form validation schema
const loginFormSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    role: z.enum(['doctor', 'patient', 'pharmacist'], { message: 'Please select a role' }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
    const { login } = useAuth();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setError(null);
            const response = await api.post('/api/auth/login', data);
            const { token } = response.data;

            Cookies.set('token', token, { expires: 7, secure: false, sameSite: 'Strict' });
            login(token);

            router.push(`/${data.role}`);
        } catch (err: unknown) {
            console.error('Login failed:', err);
            let errorMessage = 'Login failed. Please check your credentials and try again.';
            if (err instanceof AxiosError) {
                errorMessage = err.response?.data?.message;
            } else {
                console.error('Unexpected error:', err);
            }
            setError(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Login failed API error message */}
            {error && (
                <div className="p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Email Input */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                >
                    Password
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        className="mt-1 block w-full px-3 py-2 pr-10 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                            <EyeIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Role Selection */}
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select
                    id="role"
                    {...register('role')}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-50 border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                >
                    <option value="">Select your role</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                    <option value="pharmacist">Pharmacist</option>
                </select>
                {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
            >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
        </form>
    );
}