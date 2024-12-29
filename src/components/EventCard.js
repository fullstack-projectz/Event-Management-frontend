import React from 'react';

function EventCard({ event }) {
    return (
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all p-6">
            <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
            <p className="text-gray-600 my-2">{event.description}</p>
            <p className="text-gray-500 text-sm">{new Date(event.date).toLocaleDateString()}</p>
            <a href={`/events/${event._id}`} className="inline-block mt-4 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition">
                View Details
            </a>
        </div>
    );
}

export default EventCard;
