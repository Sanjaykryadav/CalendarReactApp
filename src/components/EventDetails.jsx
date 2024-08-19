import React, { useState } from "react";

const EventDetails = ({ event, onEdit, onDelete, onCancel }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Event Details</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title:</label>
          <p>{event.title}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description:</label>
          <p>{event.description}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category:</label>
          <p>{event.category}</p>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
