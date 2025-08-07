'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { TrashIcon } from '@heroicons/react/24/outline';
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

export default function DoctorDashboardPage() {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPrescriptions = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const response = await api.get('/api/prescription');
            // Filter prescriptions by the current doctor's ID
            const doctorPrescriptions = response.data.filter(
                (p: Prescription) => p.doctor.id === parseInt(user.id)
            );
            setPrescriptions(doctorPrescriptions);
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

    const handleDeletePrescription = async (prescriptionId: number) => {
        if (window.confirm('Are you sure you want to delete this prescription? This action cannot be undone.')) {
            try {
                await api.delete(`/api/prescription/${prescriptionId}`);
                setPrescriptions(prescriptions.filter(p => p.id !== prescriptionId));
                alert('Prescription deleted successfully.');
            } catch (err: any) {
                console.error('Failed to delete prescription:', err);
                alert('Failed to delete prescription. Please try again.');
            }
        }
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h2>
                <Link
                    href="/doctor/prescriptions/create"
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
                >
                    Create New Prescription
                </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">My Prescriptions</h3>
                {isLoading && <p>Loading prescriptions...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!isLoading && !error && prescriptions.length === 0 && (
                    <p className="text-gray-500">You have not created any prescriptions yet.</p>
                )}
                {!isLoading && !error && prescriptions.length > 0 && (
                    <ul className="divide-y divide-gray-200">
                        {prescriptions.map(prescription => (
                            <li key={prescription.id} className="py-4 flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-medium text-gray-900">
                                        {prescription.drug.name} for {prescription.patient.firstName} {prescription.patient.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Dosage: {prescription.dosage}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Prescribed on: {format(new Date(prescription.prescribedOn), 'MM/dd/yyyy')}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Status: {PrescriptionStatus[prescription.status]}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeletePrescription(prescription.id)}
                                    className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors duration-200"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}