'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { HomeIcon, ArchiveBoxIcon, CheckBadgeIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';

type Prescription = {
    id: string;
    drugName: string;
    dosage: string;
    status: 'Pending' | 'Dispensed' | 'Rejected';
    patientName: string;
    doctorName: string;
};

export default function PharmacistDashboardPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPrescriptions = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const response = await api.get('/api/prescription');
            setPrescriptions(response.data);
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch prescriptions:', err);
            setError('Failed to load prescriptions. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPrescriptions();
    }, [user]);

    const handleFulfill = async (prescriptionId: string) => {
        try {
            await api.put(`/api/prescription/${prescriptionId}`, { status: 2 }); // Dispensed = 2
            // Re-fetch prescriptions to update the list
            fetchPrescriptions();
        } catch (err) {
            console.error('Failed to fulfill prescription:', err);
            alert('Failed to fulfill prescription.');
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!user) {
        return null;
    }

    const activePrescriptions = prescriptions.filter(p => p.status === 'Pending');

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-xl flex flex-col p-6">
                <div className="flex-grow">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Simama</h1>
                    <div className="mb-8">
                        <p className="text-lg font-semibold text-gray-700">Welcome,</p>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>
                    <nav className="space-y-2">
                        <a href="/pharmacist" className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200">
                            <HomeIcon className="h-5 w-5" />
                            <span>Dashboard</span>
                        </a>
                        <a href="/pharmacist/dispense" className="flex items-center space-x-2 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200">
                            <ArchiveBoxIcon className="h-5 w-5" />
                            <span>Dispense</span>
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
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Pharmacist Dashboard</h2>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Pending Prescriptions ({activePrescriptions.length})</h3>
                    {isLoading && <p>Loading prescriptions...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!isLoading && !error && activePrescriptions.length === 0 && <p className="text-gray-500">There are no pending prescriptions.</p>}
                    {!isLoading && !error && activePrescriptions.length > 0 && (
                        <ul className="divide-y divide-gray-200">
                            {activePrescriptions.map(prescription => (
                                <li key={prescription.id} className="py-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-lg font-medium text-gray-900">{prescription.drugName}</p>
                                            <p className="mt-1 text-sm text-gray-500">For: {prescription.patientName}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleFulfill(prescription.id)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                <CheckBadgeIcon className="h-5 w-5 mr-2" />
                                                Fulfill
                                            </button>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">Dosage: {prescription.dosage}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
}