import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateEvent = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Fallback in case `state` is missing
    const event = location.state?.event || {};

    const [title, setTitle] = useState(event.title || '');
    const [description, setDescription] = useState(event.description || '');
    const [date, setDate] = useState(event.date || '');
    const [locationValue, setLocationValue] = useState(event.location || '');
    const [hour, setHour] = useState(event.hour || '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!location.state?.event) {
            // Redirect if event data is missing
            navigate('/events', { replace: true });
        }
    }, [location.state, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/user/login');
            return;
        }

        try {
            await axios.put(
                `https://event-management-backend-oilv.onrender.com/api/users/events/${event._id}`,
                { title, description, date, location: locationValue, hour },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccess('Event updated successfully!');
            setError('');
            setTimeout(() => navigate('/events'), 1500); // Redirect after success
        } catch (err) {
            setError('Failed to update event. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-xl">
            <h2 className="text-3xl font-semibold text-center mb-6">Update Event</h2>
            {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-500 text-white p-3 rounded mb-4">{success}</div>}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                <div className="mb-4">
                    <label htmlFor="title" className="block text-lg font-medium">Event Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mt-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-lg font-medium">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mt-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="date" className="block text-lg font-medium">Date</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mt-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="location" className="block text-lg font-medium">Location</label>
                    <input
                        type="text"
                        id="location"
                        value={locationValue}
                        onChange={(e) => setLocationValue(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mt-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="duration" className="block text-lg font-medium">Duration (hours)</label>
                    <input
                        type="number"
                        id="duration"
                        value={hour}
                        onChange={(e) => setHour(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mt-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Update Event
                </button>
            </form>
        </div>
    );
};

export default UpdateEvent;
