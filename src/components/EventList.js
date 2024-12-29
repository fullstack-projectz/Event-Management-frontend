import React, { useEffect, useState } from 'react';
import EventCard from './EventCard';
import axios from 'axios';

function EventList() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/events')
            .then((response) => setEvents(response.data))
            .catch((error) => console.error('Error fetching events:', error));
    }, []);

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {events.map((event) => (
                    <EventCard key={event._id} event={event} />
                ))}
            </div>
        </div>
    );
}

export default EventList;
