'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { ArrowRightOnRectangleIcon, UserGroupIcon, HomeIcon } from '@heroicons/react/24/outline'; // Import icons

type Patient = {
    id: string;
    name: string;
    email: string;
};

export default function DoctorDashboardPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Effect to fetch patient data when the component mounts
    useEffect(() => {
        const fetchPatients = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                // Fetch patients from the API
                const response = await api.get('/api/patients');
                setPatients(response.data);
                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch patients:', err);
                // Handle unauthorized access or other errors
                if (err.response?.status === 401 || err.response?.status === 403) {
                    setError('You are not authorized to view this page.');
                } else {
                    setError('Failed to load patients. Please try again.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatients();
    }, [user]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!user) {
        // Client-side fallback
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-xl flex flex-col p-6">
                <div className="flex-grow">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Simama</h1>
                    <div className="mb-8">
                        <p className="text-lg font-semibold text-gray-700">Welcome,</p>
                        {user?.email ? (
                            <p className="text-gray-500 text-sm">Dr. {user.email.split('@')[0]}</p>
                        ) : (
                            <p className="text-gray-500 text-sm">Welcome, Doctor</p>
                        )}
                    </div>
                    <nav className="space-y-2">
                        <a href="/doctor" className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200">
                            <HomeIcon className="h-5 w-5" />
                            <span>Dashboard</span>
                        </a>
                        <a href="/doctor/patients" className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200">
                            <UserGroupIcon className="h-5 w-5" />
                            <span>My Patients</span>
                        </a>
                    </nav>
                </div>
                {/* Logout Button */}
                <button onClick={handleLogout} className="flex items-center space-x-2 p-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-200">
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Doctor Dashboard</h2>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">My Patients</h3>
                    {isLoading && <p>Loading patients...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!isLoading && !error && patients.length === 0 && <p className="text-gray-500">You have no patients assigned.</p>}
                    {!isLoading && !error && patients.length > 0 && (
                        <ul className="divide-y divide-gray-200">
                            {patients.map(patient => (
                                <li key={patient.id} className="py-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-lg font-medium text-gray-900">{patient.name}</p>
                                        <p className="text-sm text-gray-500">{patient.email}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
}