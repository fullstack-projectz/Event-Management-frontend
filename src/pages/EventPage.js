import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);  // Added loading state to handle API request status
    const [error, setError] = useState(null);  // Added error state to display error messages

    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem('userToken');
            if (!token) {
                setError('You must be logged in to view events');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('https://event-management-backend-oilv.onrender.com/api/users/events', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEvents(response.data);
                setLoading(false); // Set loading to false after fetching events
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to fetch events. Please try again.');
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleEdit = (event) => {
        navigate(`/events/update/${event._id}`, { state: { event } });
    };

    const handleDelete = async (eventId) => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            alert('You must be logged in to delete an event');
            return;
        }

        try {
            await axios.delete(`https://event-management-backend-oilv.onrender.com/api/users/events/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(events.filter(event => event._id !== eventId));  // Remove the deleted event from the state
        } catch (err) {
            console.error('Error deleting event:', err);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-semibold text-center mb-6">Your Events</h2>
            <div className="text-right mb-4">
                <Link to="/events/create" className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition">
                    Create New Event
                </Link>
            </div>
            <div className="space-y-6">
                {events.length > 0 ? (
                    events.map(event => (
                        <div key={event._id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-semibold">Title : {event.title}</h3>
                                <p className="text-gray-700 mt-2">Desc : {event.description}</p>
                            </div>
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
                    ))
                ) : (
                    <div>No events found. Create one!</div>
                )}
            </div>
        </div>
    );
};

export default EventsList;
