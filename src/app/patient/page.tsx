'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { HomeIcon, UserIcon, ArrowRightStartOnRectangleIcon, BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { format } from 'date-fns';

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
};

type Drug = {
    id: number;
    name: string;
};

type Prescription = {
    id: number;
    dosage: string;
    prescribedOn: string;
    status: number;
    fulfilledAt: Date;
    patient: User;
    doctor: User;
    pharmacist?: User | null;
    drug: Drug;
};

enum PrescriptionStatus {
    Pending = 1,
    Dispensed = 2,
    Rejected = 3
}

export default function PatientDashboardPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                // Should be `/api/prescriptions?patientId=${user.id}`
                // TODO: Implement get patient prescription by patient id
                const response = await api.get('/api/prescription');
                setPrescriptions(response.data);
                setError(null);
            } catch (err: unknown) {
                console.error('Failed to fetch prescriptions:', err);
                setError('Failed to load prescriptions. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPrescriptions();
    }, [user]);

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
                        <p className="text-lg font-semibold text-gray-700">Welcome,</p>
                        <p className="text-gray-500 text-sm">{user.firstname} {user.lastname}</p>
                    </div>
                    <nav className="space-y-2">
                        <a href="/patient" className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200">
                            <HomeIcon className="h-5 w-5" />
                            <span>Dashboard</span>
                        </a>
                        <a href="/patient/prescriptions" className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200">
                            <BellIcon className="h-5 w-5" />
                            <span>My Prescriptions</span>
                        </a>
                        <a href="/patient/profile" className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200">
                            <UserIcon className="h-5 w-5" />
                            <span>My Profile</span>
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
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Patient Dashboard</h2>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">My Prescriptions</h3>
                    {isLoading && <p>Loading prescriptions...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!isLoading && !error && prescriptions.length === 0 && <p className="text-gray-500">You have no active prescriptions.</p>}
                    {!isLoading && !error && prescriptions.length > 0 && (
                        <ul className="divide-y divide-gray-200">
                            {prescriptions.map(prescription => (
                                <li key={prescription.id} className="py-4 flex items-center group">
                                    <Link href={`/prescription/${prescription.id}`} className="flex-grow">
                                        <div className="flex-grow group-hover:text-indigo-600 transition-colors duration-200">
                                            <p className="text-lg font-medium text-gray-900">
                                                {prescription.drug.name} for {prescription.doctor.firstName} {prescription.doctor.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Dosage: {prescription.dosage}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Prescribed on: {format(new Date(prescription.prescribedOn), 'MM/dd/yyyy')}
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
}