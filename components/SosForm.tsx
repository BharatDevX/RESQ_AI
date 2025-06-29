import React, { useState } from 'react';
import { SendIcon, LoaderIcon, FireIcon, WaterIcon, MedicalIcon, AccidentIcon } from './Icons';

interface SosFormProps {
    onSendSos: (message: string, contactNumber: string) => void;
    isLoading: boolean;
    error: string | null;
}

const quickReportCards = [
    { id: 'fire', label: 'Fire', icon: FireIcon, message: 'Fire emergency! Need help immediately.', color: 'text-red-500' },
    { id: 'flood', label: 'Flood', icon: WaterIcon, message: 'Caught in a flood. Situation is dangerous.', color: 'text-blue-500' },
    { id: 'medical', label: 'Medical', icon: MedicalIcon, message: 'Medical emergency, someone is hurt.', color: 'text-pink-500' },
    { id: 'accident', label: 'Accident', icon: AccidentIcon, message: 'There has been a serious accident.', color: 'text-orange-500' },
];

const SosForm: React.FC<SosFormProps> = ({ onSendSos, isLoading, error }) => {
    const [message, setMessage] = useState('');
    const [contactNumber, setContactNumber] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSendSos(message, contactNumber);
    };

    const handleQuickReport = (reportMessage: string) => {
        onSendSos(reportMessage, contactNumber);
    };

    const isActionDisabled = isLoading || !contactNumber.trim();

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <label htmlFor="contact-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter Contact Number for SMS Alert
                </label>
                <input
                    type="tel"
                    id="contact-number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-brand-primary focus:border-brand-primary transition"
                    placeholder="+15551234567"
                    disabled={isLoading}
                    required
                />
            </div>

             <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick SOS Reports</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickReportCards.map((card) => (
                         <button 
                            key={card.id}
                            onClick={() => handleQuickReport(card.message)}
                            disabled={isActionDisabled}
                            className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                         >
                            <card.icon className={`w-10 h-10 ${card.color} mb-2 transition-transform group-hover:scale-110`} />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{card.label}</span>
                         </button>
                    ))}
                </div>
            </div>

            <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400">Or Describe Your Situation</span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <textarea
                        id="message"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-4 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-brand-primary focus:border-brand-primary transition"
                        placeholder="e.g., 'Help, I'm stuck!', 'My house is on fire!', '¡Ayuda! Atrapado en el terremoto.'"
                        disabled={isLoading}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isActionDisabled || !message.trim()}
                    className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-brand-primary hover:bg-red-700 disabled:bg-red-400 dark:disabled:bg-red-800 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-gray-800 transition-all duration-200"
                >
                    {isLoading ? (
                        <>
                            <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                            Analyzing...
                        </>
                    ) : (
                         <>
                            <SendIcon className="mr-3 h-5 w-5" />
                            Send Custom SOS
                        </>
                    )}
                </button>
            </form>
            {error && <div className="mt-4 text-center p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300">{error}</div>}
        </div>
    );
};

export default SosForm;