import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const [todayEvents, setTodayEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/user/login');
            return;
        }

        const fetchEvents = async () => {
            try {
                const response = await axios.get('https://event-management-backend-oilv.onrender.com/api/users/events', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const events = response.data;
                const now = new Date();
                const today = events.filter(event => {
                    const eventDate = new Date(event.date);
                    return (
                        eventDate.toDateString() === now.toDateString() &&
                        eventDate > now
                    );
                });

                const upcoming = events.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate > now && eventDate.toDateString() !== now.toDateString();
                });

                setTodayEvents(today);
                setUpcomingEvents(upcoming);
            } catch (err) {
                setError('Failed to fetch events. Please try again later.');
            }
        };

        fetchEvents();
    }, [navigate]);

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white py-20 text-center">
                <h1 className="text-5xl font-extrabold mb-4">Welcome to Event Manager</h1>
                <p className="text-lg mb-8">Discover, register, and manage events with ease. Join us to create unforgettable experiences!</p>
                <a href="/events" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transition">
                    Explore Events
                </a>
            </div>

            <div className="container mx-auto p-6 text-center mt-20">
                <h2 className="text-3xl font-semibold mb-6">Today's Events</h2>
                {todayEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {todayEvents.map(event => (
                            <div key={event._id} className="bg-white shadow-lg rounded-lg p-6">
                                <h3 className="text-xl font-semibold">{event.title}</h3>
                                <p className="text-gray-700">{event.description}</p>
                                <p className="text-sm text-gray-500">{new Date(event.date).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No events for today.</p>
                )}
            </div>

            <div className="container mx-auto p-6 text-center mt-20">
                <h2 className="text-3xl font-semibold mb-6">Upcoming Events</h2>
                {upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {upcomingEvents.map(event => (
                            <div key={event._id} className="bg-white shadow-lg rounded-lg p-6">
                                <h3 className="text-xl font-semibold">{event.title}</h3>
                                <p className="text-gray-700">{event.description}</p>
                                <p className="text-sm text-gray-500">{new Date(event.date).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No upcoming events.</p>
                )}
            </div>

            {error && <div className="bg-red-500 text-white p-4 rounded mt-4">{error}</div>}
        </div>
    );
}

export default HomePage;
