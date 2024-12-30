import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        const token = localStorage.getItem('userToken');

        if (!token || !userEmail) {
            navigate('/user/login', { replace: true });
        } else {
            setUser({ name: userEmail });
            fetchEvents(token);
        }
    }, [navigate]);

    const fetchEvents = async (token) => {
        try {
            setLoading(true); // Show loader while fetching
            const response = await axios.get(
                'https://event-management-backend-oilv.onrender.com/api/users/events',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setEvents(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError('Failed to fetch events. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false); // Hide loader after fetching
        }
    };

    const handleEdit = (event) => {
        navigate(`/events/update/${event._id}`, { state: { event } });
    };

    const handleDelete = async (eventId) => {
        const token = localStorage.getItem('userToken');
        const isConfirmed = window.confirm('Are you sure you want to delete this event?'); // Show confirmation prompt

        if (isConfirmed) {
            try {
                await axios.delete(
                    `https://event-management-backend-oilv.onrender.com/api/users/events/${eventId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setEvents(events.filter((event) => event._id !== eventId));
                setSuccessMessage('Event deleted successfully!'); // Set success message
            } catch (err) {
                setError('Failed to delete event. Please try again later.');
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    if (loading) {
        return <p className="text-center text-gray-700">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="container mx-auto p-4">
            {user ? (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold">Welcome, {user.name}!</h2>
                    <h3 className="text-xl font-semibold mt-4">Your Created Events:</h3>

                    {/* Show success message if any */}
                    {successMessage && (
                        <div className="bg-green-500 text-white p-4 mb-4 rounded">
                            {successMessage}
                        </div>
                    )}

                    {events.length > 0 ? (
                        <ul className="space-y-4 mt-4">
                            {events.map((event) => (
                                <li
                                    key={event._id}
                                    className="p-4 border border-gray-300 rounded-md shadow-sm"
                                >
                                    <h4 className="font-medium text-lg">{event.title}</h4>
                                    <p className="text-sm text-gray-600">
                                        Description: {event.description}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Date: {formatDate(event.date)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Location: {event.location}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Duration: {event.hour} hours
                                    </p>
                                    <div className="mt-4 flex gap-4">
                                        <button
                                            onClick={() => handleEdit(event)}
                                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 mt-4">
                            You have not created any events yet.
                        </p>
                    )}
                </div>
            ) : (
                <p className="text-center text-gray-700">You are not logged in.</p>
            )}
        </div>
    );
};

export default Dashboard;
