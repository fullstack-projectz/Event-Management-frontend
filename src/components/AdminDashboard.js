import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from your backend (this is a mock example)
  useEffect(() => {
    // Simulate fetching events from an API
    const fetchedEvents = [
      { id: 1, title: 'Event 1', description: 'Description for event 1', date: '2024-12-30', location: 'Location 1' },
      { id: 2, title: 'Event 2', description: 'Description for event 2', date: '2024-12-31', location: 'Location 2' },
    ];
    setEvents(fetchedEvents);
    setLoading(false);
  }, []);

  // Handle deleting an event
  const handleDelete = (eventId) => {
    // In a real app, send a DELETE request to your backend to remove the event
    setEvents(events.filter(event => event.id !== eventId));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Admin Dashboard</h1>

      {/* Button to create new event */}
      <Link to="/admin/create-event">
        <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Create New Event
        </button>
      </Link>

      {loading ? (
        <p className="text-center text-gray-500">Loading events...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left text-gray-700">Event Title</th>
                <th className="px-4 py-2 text-left text-gray-700">Date</th>
                <th className="px-4 py-2 text-left text-gray-700">Location</th>
                <th className="px-4 py-2 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} className="border-b">
                  <td className="px-4 py-2">{event.title}</td>
                  <td className="px-4 py-2">{event.date}</td>
                  <td className="px-4 py-2">{event.location}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <Link to={`/admin/edit-event/${event.id}`} className="text-blue-500 hover:underline">Edit</Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
