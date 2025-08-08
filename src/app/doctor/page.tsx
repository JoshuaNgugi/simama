'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { ArrowLeftIcon, ArrowRightIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';

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

const ITEMS_PER_PAGE = 5;

export default function DoctorDashboardPage() {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

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
        if (!selectedPrescription || !user) return;

        try {
            await api.delete(`/api/prescription/${prescriptionId}`);
            setIsModalOpen(false);
            setSelectedPrescription(null);
            setPrescriptions(prescriptions.filter(p => p.id !== prescriptionId));
            toast.success('Prescription deleted successfully.');
        } catch (err: any) {
            console.error('Failed to delete prescription:', err);
            toast.error('Failed to delete prescription. Please try again.');
        }
    };

    if (!user) {
        return null;
    }

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentPrescriptions = prescriptions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(prescriptions.length / ITEMS_PER_PAGE);

    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h2>
                <Link
                    href="/doctor/prescriptions/create"
                    className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition-colors duration-200"
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
                        {currentPrescriptions.map(prescription => (
                            <li key={prescription.id} className="py-4 flex justify-between items-center group">
                                <Link href={`/prescription/${prescription.id}`} className="flex-grow">
                                    <div className="flex-grow group-hover:text-teal-600 transition-colors duration-200">
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
                                </Link>
                                <button
                                    onClick={() => {
                                        setSelectedPrescription(prescription);
                                        setIsModalOpen(true);
                                    }}
                                    className="p-2 ml-4 rounded-full text-red-500 hover:bg-red-50 transition-colors duration-200"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center px-4 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-2" /> Previous
                        </button>
                        <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center px-4 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next <ArrowRightIcon className="h-5 w-5 ml-2" />
                        </button>
                    </div>
                )}
            </div>
            {/* Delete Modal */}
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => {
                    if (selectedPrescription) {
                        handleDeletePrescription(selectedPrescription.id);
                        setIsModalOpen(false);
                    }
                }}
                prescriptionDetails={
                    selectedPrescription
                        ? {
                            drugName: selectedPrescription.drug.name,
                            patientName: `${selectedPrescription.patient.firstName} ${selectedPrescription.patient.lastName}`
                        }
                        : null
                }
            />
        </>
    );
}