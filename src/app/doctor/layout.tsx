'use client'; // This is a Client Component because it uses useAuth

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UserGroupIcon, HomeIcon, PlusIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'; // New icon for 'plus'

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!user) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-xl flex flex-col p-6">
                <div className="flex-grow">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Simama</h1>
                    <div className="mb-8">
                        {user?.email ? (
                            <>
                                <p className="text-lg font-semibold text-gray-700">Welcome,</p>
                                <p className="text-gray-500 text-sm">Dr. {user.firstname} {user.lastname}</p>
                            </>
                        ) : (
                            <p className="text-gray-500 text-sm">Welcome, Doctor</p>
                        )}
                    </div>
                    <nav className="space-y-2">
                        <a href="/doctor" className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors duration-200">
                            <HomeIcon className="h-5 w-5" />
                            <span>Dashboard</span>
                        </a>
                        <a href="/doctor/prescriptions/create" className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors duration-200">
                            <PlusIcon className="h-5 w-5" />
                            <span>New Prescription</span>
                        </a>
                        <a href="/doctor/patients" className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors duration-200">
                            <UserGroupIcon className="h-5 w-5" />
                            <span>My Patients</span>
                        </a>
                    </nav>
                </div>
                {/* Logout Button */}
                <button onClick={handleLogout} className="flex items-center space-x-2 p-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-200">
                    <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}