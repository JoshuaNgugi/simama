'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { format } from 'date-fns';
import {
    ArrowLeftIcon,
    DocumentTextIcon,
    UserIcon,
    PencilSquareIcon,
    BeakerIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

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

export default function PrescriptionDetailPage() {
    const { user } = useAuth();
    const { id } = useParams();
    const [prescription, setPrescription] = useState<Prescription | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrescription = async () => {
            if (!user || !id) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await api.get(`/api/prescription/${id}`);
                setPrescription(response.data);
                setError(null);
            } catch (err: unknown) {
                console.error('Failed to fetch prescription:', err);
                setError('Failed to load prescription details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrescription();
    }, [user, id]);

    if (isLoading) {
        return <div className="text-center p-8">Loading prescription details...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600">{error}</div>;
    }

    if (!prescription) {
        return <div className="text-center p-8">Prescription not found.</div>;
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <Link href="/doctor" className="inline-flex items-center text-gray-500 hover:text-teal-600 transition-colors duration-200 mb-6">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Dashboard
            </Link>

            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-gray-800">Prescription Details</h1>

                {/* Prescription Details Card */}
                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-3">
                            <DocumentTextIcon className="h-8 w-8 text-teal-600" />
                            <h2 className="text-2xl font-bold text-gray-800">
                                {prescription.drug.name}
                            </h2>
                        </div>
                        <span className={`px-4 py-1 rounded-full text-sm font-medium ${prescription.status == PrescriptionStatus.Pending ? 'bg-teal-100 text-teal-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {PrescriptionStatus[prescription.status]}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="flex items-center text-gray-600">
                            <BeakerIcon className="h-5 w-5 text-gray-400 mr-3" />
                            <span>
                                Dosage: {prescription.dosage}
                            </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                            <span>
                                Prescribed On: {format(new Date(prescription.prescribedOn), 'MMMM d, yyyy')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Patient and Doctor Details Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Patient Card */}
                    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <UserIcon className="h-6 w-6 text-teal-600" />
                            <h3 className="text-xl font-bold text-gray-800">Patient Details</h3>
                        </div>
                        <div className="space-y-2">
                            <p className="text-gray-600">Name: {prescription.patient.firstName} {prescription.patient.lastName}</p>
                            <p className="text-gray-600">Email: {prescription.patient.email}</p>
                        </div>
                    </div>

                    {/* Doctor Card */}
                    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <PencilSquareIcon className="h-6 w-6 text-teal-600" />
                            <h3 className="text-xl font-bold text-gray-800">Doctor Details</h3>
                        </div>
                        <div className="space-y-2">
                            <p className="text-gray-600">Name: {prescription.doctor.firstName} {prescription.doctor.lastName}</p>
                            <p className="text-gray-600">Email: {prescription.doctor.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}