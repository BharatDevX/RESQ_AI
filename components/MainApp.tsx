import React, { useState, useCallback } from 'react';
import { classifyMessage } from '../services/geminiService';
import type { ClassificationResult, UserLocation } from '../types';
import SosForm from './SosForm';
import MapView from './MapView';

export type SmsStatus = 'idle' | 'sending' | 'sent' | 'failed';

const MainApp: React.FC = () => {
    const [currentView, setCurrentView] = useState<'SOS_FORM' | 'MAP_VIEW'>('SOS_FORM');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ClassificationResult | null>(null);
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [message, setMessage] = useState<string>('');
    const [contactNumber, setContactNumber] = useState<string>('');
    const [smsStatus, setSmsStatus] = useState<SmsStatus>('idle');

    const handleGetLocation = useCallback((): Promise<UserLocation> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation is not supported by your browser."));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    resolve(newLocation);
                },
                () => {
                    reject(new Error("Unable to retrieve your location. Please enable location services."));
                }
            );
        });
    }, []);

    const sendSmsAlert = async (sosMessage: string, recipientNumber: string, userLocation: UserLocation) => {
        setSmsStatus('sending');
        try {
            const fullMessage = `SOS ALERT: "${sosMessage}"\n\nReported at location: https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`;
            
            const response = await fetch("http://localhost:5000/send_sos", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipient: recipientNumber,
                    message: fullMessage,
                }),
            });
            console.log("Sending SMS with:", { recipient: recipientNumber, message: fullMessage });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send SMS.');
            }
            
            setSmsStatus('sent');

        } catch (smsError: any) {
            console.error("SMS sending failed:", smsError);
            setError(prev => prev ? `${prev} And SMS sending failed: ${smsError.message}` : `SMS sending failed: ${smsError.message}`);
            setSmsStatus('failed');
        }
    };

    const handleSendSos = async (sosMessage: string, number: string) => {
        if (!sosMessage.trim()) {
            setError("Message cannot be empty.");
            return;
        }
        if (!number.trim()) {
            setError("Contact number cannot be empty.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);
        setLocation(null);
        setMessage(sosMessage);
        setContactNumber(number);
        setSmsStatus('idle');

        try {
            const userLocation = await handleGetLocation();
            setLocation(userLocation);

            const classificationResult = await classifyMessage(sosMessage);
            setResult(classificationResult);
            
            setCurrentView('MAP_VIEW');

            if (classificationResult.isEmergency) {
                await sendSmsAlert(sosMessage, number, userLocation);
            }
            
        } catch (err: any) {
            setError(err.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoBack = () => {
        setCurrentView('SOS_FORM');
        setResult(null);
        setLocation(null);
        setError(null);
        setMessage('');
        setContactNumber('');
        setSmsStatus('idle');
    };

    return (
        <main className="container mx-auto p-4 md:p-8">
             <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-widest">RESQ-AI</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Your AI-Powered Emergency Response Assistant</p>
            </div>
            
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-500">
                {currentView === 'SOS_FORM' && (
                    <SosForm onSendSos={handleSendSos} isLoading={isLoading} error={error} />
                )}
                {currentView === 'MAP_VIEW' && (
                    <MapView 
                        onBack={handleGoBack} 
                        result={result} 
                        location={location} 
                        message={message}
                        smsStatus={smsStatus}
                        contactNumber={contactNumber}
                    />
                )}
            </div>
        </main>
    );
};

export default MainApp;