import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function BottomSticky() {
    const [stickyClass, setStickyClass] = useState('relative');

    useEffect(() => {
        window.addEventListener('scroll', stickNavbar);

        return () => {
            window.removeEventListener('scroll', stickNavbar);
        };
    }, []);

    const stickNavbar = () => {
        if (window !== undefined) {
            let windowHeight = window.scrollY;
            setStickyClass('fixed bottom-0 left-0 z-50')
        }
    };

    return (
        <div className={`h-16 w-full bg-gray-200 ${stickyClass}`}>
            <div className="flex justify-between h-full px-4">
                <Link to="/" className="flex items-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0L5 10m7-7v18" />
                    </svg>
                    <span className="font-bold">Home</span>
                </Link>
                <Link to="/categories" className="flex items-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span className="font-bold">Categories</span>
                </Link>
                <Link to="/users/reservations" className="flex items-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span className="font-bold">Reservations</span>
                </Link>
                <Link to="/" className="flex items-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span className="font-bold">Account</span>
                </Link>
            </div>
        </div>
    );
}
