import React, { useState, useEffect } from "react";

const EventModal = ({
  isOpen,
  onClose,
  selectedDate,
  selectedEvent,
  addEvent,
  editEvent,
  deleteEvent,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Work");

  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.event.title);
      setDescription(selectedEvent.event.description);
      setCategory(selectedEvent.event.category || "Work");

      const [selectedYear, selectedMonth, selectedDay] = selectedDate.split("-");
      setDate(selectedDay);
      setMonth(selectedMonth);
      setYear(selectedYear);
    } else {
      setTitle("");
      setDescription("");
      setCategory("Work");

      setDate("");
      setMonth("");
      setYear("");
    }
  }, [selectedEvent, selectedDate]);

  const handleSave = () => {
    const newEvent = { title, description, category };

    const selectedDate = `${year}-${month.padStart(2, "0")}-${date.padStart(2, "0")}`;

    if (selectedEvent) {
      editEvent(selectedDate, selectedEvent.index, newEvent);
    } else {
      addEvent(selectedDate, newEvent);
    }
    onClose();
  };

  const handleDelete = () => {
    if (selectedEvent) {
      deleteEvent(selectedDate, selectedEvent.index);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {selectedEvent ? "Edit Event" : "Add Event"}
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 border rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="w-full px-3 py-2 border rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Holiday">Holiday</option>
            <option value="Others">Others</option>
          </select>
        </div>
        {/* Date, Month, Year Inputs */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min="1"
              max="31"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Month</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              min="1"
              max="12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="1900"
              max="2100"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          {selectedEvent && (
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleSave}
          >
            {selectedEvent ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
