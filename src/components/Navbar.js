import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');
        const adminToken = localStorage.getItem('adminToken');

        if (userToken) {
            setIsLoggedIn(true);
            setIsAdmin(false); // User is logged in, not admin
        } else if (adminToken) {
            setIsLoggedIn(true);
            setIsAdmin(true); // Admin is logged in
        } else {
            setIsLoggedIn(false); // No token means not logged in
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('adminToken');
        setIsLoggedIn(false);
        setIsAdmin(false);
    };

    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-xl font-semibold">Event Management</div>
                <div>
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/" className="hover:text-gray-200">Home</Link>
                        </li>
                        <li>
                            <Link to="/events" className="hover:text-gray-200">Events</Link>
                        </li>

                        {/* Show user/admin-specific links */}
                        {!isLoggedIn && (
                            <>
                                <li>
                                    <Link to="/user/login" className="hover:text-gray-200">User Login</Link>
                                </li>
                                <li>
                                    <Link to="/admin/login" className="hover:text-gray-200">Admin Login</Link>
                                </li>
                            </>
                        )}

                        {isLoggedIn && (
                            <>
                                {isAdmin ? (
                                    <li>
                                        <Link to="/admin/dashboard" className="hover:text-gray-200">Admin Dashboard</Link>
                                    </li>
                                ) : (
                                    <li>
                                        <Link to="/user/dashboard" className="hover:text-gray-200">Dashboard</Link>
                                    </li>
                                )}
                                <li>
                                    <button onClick={handleLogout} className="hover:text-gray-200">Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
