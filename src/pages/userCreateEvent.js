import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [hour, setHour] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/user/login');
            return;
        }

        try {
            await axios.post(
                'https://event-management-backend-oilv.onrender.com/api/users/events',
                { title, description, date, location, hour },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccess('Event created successfully!');
            setError('');
            navigate('/events');
        } catch (err) {
            setError('Failed to create event. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-xl">
            <h2 className="text-3xl font-semibold text-center mb-6">Create New Event</h2>
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
                        placeholder="Enter event title"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-lg font-medium">Event Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mt-2"
                        placeholder="Enter event description"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="date" className="block text-lg font-medium">Event Date</label>
                    <input
                        type="datetime-local"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mt-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="location" className="block text-lg font-medium">Event Location</label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mt-2"
                        placeholder="Enter event location"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="duration" className="block text-lg font-medium">Event Duration (hours)</label>
                    <input
                        type="number"
                        id="duration"
                        value={hour}
                        onChange={(e) => setHour(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mt-2"
                        placeholder="Enter event duration"
                        required
                    />
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
                    >
                        Create Event
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEvent;
