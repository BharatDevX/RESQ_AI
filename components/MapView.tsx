import React from 'react';
import type { ClassificationResult, UserLocation } from '../types';
import { type SmsStatus } from './MainApp';
import MapDisplay from './MapDisplay';
import { AlertTriangleIcon, CheckCircleIcon, MapPinIcon, ArrowLeftIcon, LoaderIcon } from './Icons';

interface MapViewProps {
    onBack: () => void;
    result: ClassificationResult | null;
    location: UserLocation | null;
    message: string;
    smsStatus: SmsStatus;
    contactNumber: string;
}

const ResultCard: React.FC<{ result: ClassificationResult; smsStatus: SmsStatus; contactNumber: string; }> = ({ result, smsStatus, contactNumber }) => {
    
    const SmsAlertStatus = () => {
        if (!result.isEmergency) return null;

        switch (smsStatus) {
            case 'sending':
                return (
                    <div className="mt-4 p-4 rounded-md bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 flex items-center">
                        <LoaderIcon className="animate-spin w-5 h-5 mr-3" />
                        <span>Sending SMS alert to <strong>{contactNumber}</strong>...</span>
                    </div>
                );
            case 'sent':
                return (
                     <div className="mt-4 p-4 rounded-md bg-green-200 dark:bg-green-800/50 text-green-800 dark:text-green-200 flex items-center">
                        <CheckCircleIcon className="w-5 h-5 mr-3" />
                        <span>SMS alert sent successfully to <strong>{contactNumber}</strong>.</span>
                    </div>
                );
            case 'failed':
                return (
                    <div className="mt-4 p-4 rounded-md bg-yellow-200 dark:bg-yellow-800/50 text-yellow-800 dark:text-yellow-300 flex items-center">
                        <AlertTriangleIcon className="w-5 h-5 mr-3" />
                        <span>Failed to send SMS alert. Please check the number and try again.</span>
                    </div>
                );
            case 'idle':
            default:
                // This state is briefly visible before the SMS call is made.
                return (
                     <div className="mt-4 p-4 rounded-md bg-red-200 dark:bg-red-800/50 text-red-800 dark:text-red-200">
                        <p>Preparing to send SMS alert...</p>
                    </div>
                );
        }
    };
    
    return (
        <div className={`mt-6 p-6 rounded-lg shadow-lg transition-all duration-500 ${result.isEmergency ? 'bg-red-100 dark:bg-red-900/40 border-l-4 border-red-500' : 'bg-green-100 dark:bg-green-900/40 border-l-4 border-green-500'}`}>
            <div className="flex items-center">
                {result.isEmergency ? <AlertTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" /> : <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />}
                <h3 className="ml-4 text-2xl font-bold">{result.isEmergency ? 'Emergency Detected' : 'Situation Normal'}</h3>
            </div>
            
            <SmsAlertStatus />

            <div className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                <p><span className="font-semibold">Confidence:</span> {result.confidence.toFixed(2)}%</p>
                <p><span className="font-semibold">AI Reasoning:</span> "{result.reasoning}"</p>
            </div>
        </div>
    );
};

const MapView: React.FC<MapViewProps> = ({ onBack, result, location, message, smsStatus, contactNumber }) => {
    return (
        <div className="animate-fade-in">
            <div className="mb-4">
                 <button 
                    onClick={onBack}
                    className="flex items-center px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                 >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Send Another Alert
                 </button>
            </div>
            
            {result && <ResultCard result={result} smsStatus={smsStatus} contactNumber={contactNumber} />}

            <div className="mt-6">
                <h3 className="text-xl font-bold flex items-center mb-4">
                    <MapPinIcon className="w-6 h-6 mr-2" />
                    Live Location
                </h3>
                <div className="h-96 w-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-inner">
                   {location ? (
                        <MapDisplay location={location} isEmergency={result?.isEmergency ?? false} message={message} />
                   ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Retrieving location...</p>
                        </div>
                   )}
                </div>
            </div>
        </div>
    );
};

export default MapView;