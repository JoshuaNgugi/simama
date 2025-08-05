'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

type Patient = {
    id: string;
    name: string;
    email: string;
};

export default function DoctorDashboardPage() {
    const { user } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatients = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await api.get('/api/patients');
                setPatients(response.data);
                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch patients:', err);
                setError('Failed to load patients. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatients();
    }, [user]);

    if (!user) {
        return null;
    }

    return (
        <>
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
        </>
    );
}