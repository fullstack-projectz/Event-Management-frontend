import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const AdminDashboard = () => {
    const [admin, setAdmin] = useState(null);
    const [events, setEvents] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch admin details and verify token
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
        } else {
            setAdmin({
                name: 'Admin',
                email: 'admin@gmail.com',
                totalEvents: 0,
                approvedEvents: 0,
                pendingEvents: 0,
                rejectedEvents: 0,
            });
        }
    }, [navigate]);

    // Fetch events data from the API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('https://event-management-backend-oilv.onrender.com/api/admin/events', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
                });

                const eventsData = response.data;

                // Calculate event counts for the admin summary
                const totalEvents = eventsData.length;
                const approvedEvents = eventsData.filter(event => event.status === 'Approved').length;
                const pendingEvents = eventsData.filter(event => event.status === 'Pending').length;
                const rejectedEvents = eventsData.filter(event => event.status === 'Rejected').length;

                setAdmin(prev => ({
                    ...prev,
                    totalEvents,
                    approvedEvents,
                    pendingEvents,
                    rejectedEvents,
                }));

                setEvents(eventsData);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    // Handle updated event from the state
    useEffect(() => {
        if (location.state && location.state.updatedEvent) {
            const updatedEvent = location.state.updatedEvent;
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event._id === updatedEvent._id ? updatedEvent : event
                )
            );
        }
    }, [location.state]);

    // Navigate to the edit event page
    const handleEditEvent = (event) => {
        navigate(`/admin/edit-event/${event._id}`, { state: { eventData: event } });
    };

    // Handle event deletion
    const handleDeleteEvent = async (id) => {
        try {
            await axios.delete(`https://event-management-backend-oilv.onrender.com/api/admin/events/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
            });
            setEvents(prevEvents => prevEvents.filter(event => event._id !== id));
            setSuccessMessage('Event deleted successfully!');
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            {admin ? (
                <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                    <h2 className="text-3xl font-semibold text-blue-600">Welcome, {admin.name}!</h2>
                    <p className="text-sm text-gray-500 mt-2">Email: {admin.email}</p>
                    <h3 className="text-xl font-semibold text-gray-700 mt-6">Admin Overview:</h3>
                    <ul className="list-disc pl-6 mt-4 text-gray-600">
                        <li>Total Events: <span className="text-blue-600">{admin.totalEvents}</span></li>
                        <li>Approved Events: <span className="text-green-500">{admin.approvedEvents}</span></li>
                        <li>Pending Events: <span className="text-yellow-500">{admin.pendingEvents}</span></li>
                        <li>Rejected Events: <span className="text-red-500">{admin.rejectedEvents}</span></li>
                    </ul>
                </div>
            ) : (
                <p>Loading...</p>
            )}

            {/* Display success message */}
            {successMessage && (
                <div className="bg-green-500 text-white p-3 rounded mb-4">
                    {successMessage}
                </div>
            )}

            {/* Event List */}
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Event List</h3>
                <table className="min-w-full table-auto text-sm text-left">
                    <thead className="border-b border-gray-200">
                        <tr>
                            <th className="py-3 px-4 font-medium text-gray-600">Event Name</th>
                            <th className="py-3 px-4 font-medium text-gray-600">Event Date</th>
                            <th className="py-3 px-4 font-medium text-gray-600">Description</th>
                            <th className="py-3 px-4 font-medium text-gray-600">Location</th>
                            <th className="py-3 px-4 font-medium text-gray-600">Status</th>
                            <th className="py-3 px-4 font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event, index) => (
                            <tr key={event._id || index} className="border-b border-gray-100">
                                <td className="py-3 px-4">{event.title}</td>
                                <td className="py-3 px-4">
                                    {new Date(event.date).toLocaleDateString('en-GB')}
                                </td>
                                <td className="py-3 px-4 text-gray-700">
                                    {event.description
                                        ? `${event.description.slice(0, 50)}...`
                                        : 'No Description'}
                                </td>
                                <td className="py-3 px-4">{event.location}</td>
                                <td className="py-3 px-4">{event.status}</td>
                                <td className="py-3 px-4 flex space-x-4">
                                    <button
                                        onClick={() => handleEditEvent(event)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteEvent(event._id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
