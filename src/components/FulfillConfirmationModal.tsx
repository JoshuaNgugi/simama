'use client';

import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

type FulfillConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    prescriptionDetails: {
        drugName: string;
        patientName: string;
    } | null;
};

export function FulfillConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    prescriptionDetails,
}: FulfillConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-opacity">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full mx-4 transform transition-transform scale-100 opacity-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Confirm Fulfillment</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="text-center mb-6">
                    <CheckCircleIcon className="h-16 w-16 text-teal-500 mx-auto mb-4" />
                    <p className="text-gray-600">
                        Are you sure you want to mark the prescription for {prescriptionDetails?.drugName}
                        as fulfilled for {prescriptionDetails?.patientName}?
                    </p>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg text-white bg-teal-500 hover:bg-teal-600 transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}