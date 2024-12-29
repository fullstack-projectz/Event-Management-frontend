import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const EventPage = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/user/login');
            return;
        }

        axios.get('https://event-management-backend-oilv.onrender.com/api/users/events', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                setEvents(response.data);
            })
            .catch(() => {
                setError('Failed to fetch events.');
            });
    }, [navigate]);

    const handleEdit = (event) => {
        navigate(`/events/update/${event._id}`, { state: { event } });
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            setError('Please login to delete events.');
            setSuccess('');
            return;
        }

        try {
            await axios.delete(`https://event-management-backend-oilv.onrender.com/api/users/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(events.filter(event => event._id !== id));
            setSuccess('Event deleted successfully!');
            setError('');
        } catch (err) {
            setError('Failed to delete event.');
            setSuccess('');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-semibold text-center mb-6">Your Events</h2>

            {/* Display error or success messages */}
            {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-500 text-white p-3 rounded mb-4">{success}</div>}

            <div className="text-right mb-6">
                <Link
                    to="/events/create"
                    className="text-3xl bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
                    title="Create New Event"
                >
                    <i className="fas fa-plus"></i>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event._id} className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold">{event.title}</h3>
                        <p className="text-gray-700">{event.description}</p>
                        <p className="text-sm text-gray-500">{new Date(event.date).toLocaleString()}</p>
                        <p className="text-sm text-gray-500 font-bold">STATUS: {event.status}</p>

                        <div className="flex justify-between mt-4">
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
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventPage;
