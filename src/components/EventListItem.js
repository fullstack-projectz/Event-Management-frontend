import React from 'react';

function EventListItem({ event, onApprove, onReject }) {
  return (
    <div className="p-4 border-b border-gray-300">
      <h2 className="text-xl font-bold">{event.title}</h2>
      <p>{event.description}</p>
      <p className="text-gray-500">{event.location}</p>
      <p className="text-gray-500">Date: {new Date(event.date).toLocaleDateString()}</p>

      <div className="mt-4">
        <button
          onClick={() => onApprove(event._id)}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Approve
        </button>
        <button
          onClick={() => onReject(event._id)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default EventListItem;
