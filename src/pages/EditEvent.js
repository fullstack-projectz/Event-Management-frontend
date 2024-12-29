import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const EditEvent = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const { eventData } = location.state || {}; 


    const [formData, setFormData] = useState({
        title: '',
        date: '',
        hour: '',
        description: '',
        location: '',
        status: 'Pending',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Update form data only if eventData exists
    useEffect(() => {
        if (eventData) {
            console.log('Event Data:', eventData); 
            const dateFromAPI = eventData.date?.$date;
            const formattedDate = dateFromAPI ? new Date(dateFromAPI).toISOString().split('T')[0] : '';

            setFormData({
                title: eventData.title || '',
                date: formattedDate,
                hour: eventData.hour || '',
                description: eventData.description || '',
                location: eventData.location || '',
                status: eventData.status || 'Pending',
            });
        } else {
            setError('Event data not found.');
        }
    }, [eventData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData); 

        if (!eventData?._id) {
            setError('Event ID is missing.');
            return;
        }

        if (!formData.title || !formData.date) {
            setError('Please fill out all fields.');
            return;
        }

        try {
            const response = await axios.patch(
                `https://event-management-backend-oilv.onrender.com/api/admin/events/${eventData._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
                    },
                }
            );

            console.log('Response:', response); 
            if (response.status === 200) {
                setSuccessMessage('Event updated successfully!');
                navigate('/admin/dashboard', { state: { updatedEvent: response.data } });
            }
        } catch (err) {
            console.error('Error updating event:', err);
            setError('Failed to update event. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Edit Event</h1>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            {successMessage && <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>}

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 shadow-md rounded-lg">
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700">Event Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title || ''}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="date" className="block text-gray-700">Event Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date || ''}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="hour" className="block text-gray-700">Event Hour</label>
                    <input
                        type="number"
                        id="hour"
                        name="hour"
                        value={formData.hour || ''}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="location" className="block text-gray-700">Event Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location || ''}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700">Event Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows="4"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="status" className="block text-gray-700">Event Status</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status || 'Pending'}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Update Event
                </button>
            </form>
        </div>
    );
};

export default EditEvent;
