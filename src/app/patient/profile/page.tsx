'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type Patient = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
};

export default function PatientProfilePage() {
    const { user } = useAuth();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatientData = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await api.get(`/api/patients/${user.id}`);
                setPatient(response.data);
            } catch (err: unknown) {
                console.error('Failed to fetch patient data:', err);
                setError('Failed to load your profile. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatientData();
    }, [user]);

    if (isLoading) {
        return <div className="text-center p-8">Loading profile...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600">{error}</div>;
    }

    if (!patient) {
        return <div className="text-center p-8">No profile data available.</div>;
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>

            {/* Main Profile Card */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                <div className="flex items-center space-x-6">
                    {/* A simple placeholder for a profile picture, consistent with the theme */}
                    <div className="h-24 w-24 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 text-3xl font-bold">
                        {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-800">
                            {patient.firstName} {patient.lastName}
                        </h3>
                        <p className="text-gray-500 mt-1">Patient ID: {patient.id}</p>
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    <div className="flex items-center text-gray-600">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <span>{patient.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <span>{patient.phoneNumber || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {/* Related Information Card */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">My Prescriptions</h3>
                <p className="text-gray-600 mt-2">
                    View and manage all of your past and active prescriptions.
                </p>
                <Link
                    href="/patient/prescriptions"
                    className="mt-4 inline-flex items-center font-medium text-teal-600 hover:text-teal-800 transition-colors duration-200"
                >
                    Go to Prescriptions
                </Link>
            </div>
        </div>
    );
}