import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
    const [email, setEmail] = useState('');  
    const [password, setPassword] = useState(''); 
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send request to the backend API for login
            const response = await axios.post('https://event-management-backend-oilv.onrender.com/api/admin/login', { email, password });

            if (response.status === 200) {
              
                localStorage.setItem('adminToken', response.data.token);
               
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError('Invalid credentials or server error');
        }
    };

    return (
        <div className="container mx-auto max-w-md p-4 mt-10 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
