'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

// Define types for fetched data
type Patient = { id: string; firstName: string; lastName: string };
type Drug = { id: string; name: string };

// Define validation schema
const prescriptionFormSchema = z.object({
    patientId: z.string().nonempty({ message: 'Patient selection is required.' }),
    drugId: z.string().nonempty({ message: 'Drug selection is required.' }),
    dosage: z.string().nonempty({ message: 'Dosage is required.' }),
});

type PrescriptionFormValues = z.infer<typeof prescriptionFormSchema>;

export default function CreatePrescriptionPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [drugs, setDrugs] = useState<Drug[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);

    // Fetch patients and drugs to populate the form
    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }
            try {
                const [patientsResponse, drugsResponse] = await Promise.all([
                    api.get('/api/patients'),
                    api.get('/api/drug')
                ]);
                setPatients(patientsResponse.data);
                setDrugs(drugsResponse.data);
            } catch (err: any) {
                console.error('Failed to fetch data for form:', err);
                setApiError('Failed to load patients or drugs. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user]);

    // Initialize the form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PrescriptionFormValues>({
        resolver: zodResolver(prescriptionFormSchema),
    });

    // Handle form submission
    const onSubmit = async (data: PrescriptionFormValues) => {
        try {
            setApiError(null);

            const prescriptionData = {
                PatientId: parseInt(data.patientId),
                DoctorId: parseInt(user!.id),
                DrugId: parseInt(data.drugId),
                Dosage: data.dosage,
            };

            // API call to create a new prescription
            await api.post('/api/prescription', prescriptionData);

            alert('Prescription created successfully!');
            router.push('/doctor'); // Redirect back to dashboard
        } catch (err: any) {
            console.error('Failed to create prescription:', err);
            const errorMessage = err.response?.data?.message || 'Failed to create prescription.';
            setApiError(errorMessage);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8 bg-white rounded-lg shadow-md border border-gray-200">
                <p>Loading form data...</p>
            </div>
        );
    }

    if (apiError) {
        return (
            <div className="flex items-center justify-center p-8 bg-red-100 rounded-lg border border-red-400 text-red-700">
                <p>{apiError}</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center mb-6">
                <a href="/doctor" className="text-gray-500 hover:text-gray-700">
                    <ArrowUturnLeftIcon className="h-6 w-6" />
                </a>
                <h2 className="text-3xl font-bold text-gray-800 ml-4">Create New Prescription</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Patient Selection */}
                <div>
                    <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient</label>
                    <select
                        id="patientId"
                        {...register('patientId')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-50 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">Select a patient</option>
                        {patients.map(patient => (
                            <option key={patient.id} value={patient.id}>{patient.firstName} {patient.lastName}</option>
                        ))}
                    </select>
                    {errors.patientId && <p className="mt-1 text-sm text-red-600">{errors.patientId.message}</p>}
                </div>

                {/* Drug Selection */}
                <div>
                    <label htmlFor="drugId" className="block text-sm font-medium text-gray-700">Drug</label>
                    <select
                        id="drugId"
                        {...register('drugId')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-50 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">Select a drug</option>
                        {drugs.map(drug => (
                            <option key={drug.id} value={drug.id}>{drug.name}</option>
                        ))}
                    </select>
                    {errors.drugId && <p className="mt-1 text-sm text-red-600">{errors.drugId.message}</p>}
                </div>

                {/* Dosage Input */}
                <div>
                    <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">Dosage</label>
                    <input
                        id="dosage"
                        type="text"
                        {...register('dosage')}
                        className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.dosage && <p className="mt-1 text-sm text-red-600">{errors.dosage.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isSubmitting ? 'Creating...' : 'Create Prescription'}
                </button>
            </form>
        </div>
    );
}