import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface NotificationToasterProps {
    message: string;
    type: 'success' | 'error';
    duration?: number;
}

export default function NotificationToaster ( { message, type, duration = 3000 }: NotificationToasterProps ) {
    // Use useEffect to trigger the toast notification when message or type changes
    useEffect( () => {
        if ( type === 'success' ) {
            toast.success( message, {
                duration,
                position: 'top-right',
                style: {
                    background: '#4CAF50',
                    color: '#fff',
                },
            } );
        } else if ( type === 'error' ) {
            toast.error( message, {
                duration,
                position: 'top-right',
                style: {
                    background: '#F44336',
                    color: '#fff',
                },
            } );
        }
    }, [ message, type, duration ] ); // Depend on message, type, and duration changes

    return <Toaster />;
}
