import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from submitting and page reload

    setError(''); // Clear any previous errors

    try {
      // Make a POST request to the backend API for login
      const response = await axios.post(
        'https://event-management-backend-oilv.onrender.com/api/users/login',
        { email, password }
      );
      if (response.status === 200) {
        const { token } = response.data;
        if (token) {
          // Store token and user email in localStorage
          localStorage.setItem('userToken', token);
          localStorage.setItem('userEmail', email);
          console.log("login done");
          
          navigate('/dashboard');
        } else {
          setError('Invalid login response. Token missing.');
        }
      }
    } catch (err) {
      // Handle login error
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 'An error occurred. Please check your credentials.'
      );
    }
  };

  return (
    <div className="container mx-auto max-w-md p-4 mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">User Login</h2>
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

      {/* Registration Link */}
      <div className="mt-4 text-center">
        <p className="text-sm">
          Didn't create an account?{' '}
          <Link to="/user/register" className="text-blue-600 hover:underline">Register now</Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
