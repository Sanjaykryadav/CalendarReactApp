import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Context } from "../Context";
import EventModal from "./EventModal";
import EventDetails from "./EventDetails"; // Make sure this component is defined
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay,
  isAfter,
} from "date-fns";
import { Loader } from 'rsuite';

const defaultEvents = {
  "2024-03-25": [{ title: "Holi", description: "Festival of Colors", category: "Holiday" }],
  "2024-11-12": [{ title: "Diwali", description: "Festival of Lights", category: "Holiday" }],
};

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState("All");
  const [apiEvents, setApiEvents] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false); 

  const { events, addEvent, editEvent, deleteEvent } = useContext(Context);

  useEffect(() => {
    fetchApiEvents();
  }, [currentMonth, currentYear]);

  const fetchApiEvents = async () => {
    try {
      setLoading(true);
      const apiKey = "TpYSeD4gB0OYnz1872nJLFJlnHgsZPRt"; 
      const country = "IN";
      const year = currentYear;
      const month = currentMonth + 1; 

      const response = await axios.get(
        `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${year}&month=${month}`
      );

      if (response.data?.response?.holidays) {
        const holidays = response.data.response.holidays.reduce((acc, holiday) => {
          const dateKey = holiday.date.iso.split("T")[0];
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push({
            title: holiday.name,
            description: holiday.description || "Holiday",
            category: "Holiday",
          });
          return acc;
        }, {});

        setApiEvents(holidays);
      } else {
        console.error("Invalid API response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching events from API:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="flex justify-between items-center mb-4 px-4">
        <button
          className="text-gray-700 bg-gray-200 hover:bg-gray-300 rounded px-2 py-1 shadow-md transition-colors outline-none"
          onClick={prevMonth}
        >
          &lt;
        </button>
        <span className="text-xl font-bold text-gray-700">
          {format(new Date(currentYear, currentMonth), dateFormat)}
        </span>
        <button
          className="text-gray-700 bg-gray-200 hover:bg-gray-300 rounded px-2 py-1 shadow-md transition-colors outline-none"
          onClick={nextMonth}
        >
          &gt;
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEE";
    const startDate = startOfWeek(new Date(currentYear, currentMonth));

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center font-medium text-gray-600" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="grid grid-cols-7">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(new Date(currentYear, currentMonth));
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const dayKey = format(day, "yyyy-MM-dd");
        const dayEvents = [
          ...(defaultEvents[dayKey] || []),
          ...(events[dayKey] || []),
          ...(apiEvents[dayKey] || []),
        ];
        const isToday = isSameDay(day, new Date());
        const isPastDate = isAfter(new Date(), day);

        const filteredEvents = filter === "All"
          ? dayEvents
          : dayEvents.filter(event => event.category === filter);

        days.push(
          <div
            className={`p-4 border h-32 cursor-pointer flex flex-col justify-between ${
              !isSameMonth(day, monthStart)
                ? "bg-gray-100"
                : isToday
                ? "bg-yellow-100 border-yellow-400"
                : "bg-white"
            }`}
            key={day}
            onClick={() => {
              if (!isPastDate) {
                onDateClick(cloneDay);
              }
            }}
          >
            <div className="text-right font-semibold">{formattedDate}</div>
            <div className="mt-2 flex flex-col space-y-1">
              {filteredEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="text-sm bg-blue-100 text-blue-800 p-1 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEventDetails(event, idx, cloneDay);
                  }}
                >
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day} className="grid grid-cols-7 h-32">{days}</div>);
      days = [];
    }
    return <div>{rows}</div>;
  };

  const onDateClick = (day) => {
    setSelectedDate(format(day, "yyyy-MM-dd"));
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const openEventDetails = (event, index, day) => {
    setSelectedDate(format(day, "yyyy-MM-dd"));
    setSelectedEvent({ event, index });
    setDetailsOpen(true); 
  };

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth + 1) % 12);
    if (currentMonth === 11) {
      setCurrentYear((prevYear) => prevYear + 1);
    }
  };

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    if (currentMonth === 0) {
      setCurrentYear((prevYear) => prevYear - 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(new Date().getMonth());
    setCurrentYear(new Date().getFullYear());
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div className="h-screen w-screen p-4 bg-gray-50">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
        <div className="flex space-x-2 mb-4 lg:mb-0">
          <button
            className="text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2 shadow-md  outline-none hover:scale-105 transition"
            onClick={() => setModalOpen(true)}
          >
            Add Event
          </button>
          <button
            className="text-white bg-gray-500 hover:bg-gray-600 rounded px-4 py-2 shadow-md transition-colors outline-none hover:scale-105"
            onClick={goToToday}
          >
            Today
          </button>
          <select
            value={filter}
            onChange={handleFilterChange}
            className="text-gray-700 bg-gray-200 hover:bg-gray-300 rounded px-2 py-1 shadow-md transition-colors"
          >
            <option value="All">Filter Events</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Holiday">Holiday</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(Number(e.target.value))}
            className="text-gray-700 bg-gray-200 hover:bg-gray-300 rounded px-2 py-1 shadow-md transition-colors"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index} value={index}>
                {format(new Date(2024, index), "MMMM")}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={currentYear}
            onChange={(e) => setCurrentYear(Number(e.target.value))}
            className="text-gray-700 bg-gray-200 hover:bg-gray-300 rounded px-2 py-1 shadow-md transition-colors"
          />
        </div>
      </div>
      {renderHeader()}
      {renderDays()}
      {loading ? (
        <div className="h-[60%] w-screen flex justify-center items-center">
        <Loader size="lg"/>
        </div>
      ) : (
        renderCells()
      )}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        selectedDate={selectedDate}
        selectedEvent={selectedEvent}
        addEvent={addEvent}
        editEvent={editEvent}
        deleteEvent={deleteEvent}
      />

      {isDetailsOpen && (
        <EventDetails
          event={selectedEvent?.event}
          onEdit={() => {
            setDetailsOpen(false);
            setModalOpen(true);
          }}
          onDelete={() => {
            deleteEvent(selectedDate, selectedEvent.index);
            setDetailsOpen(false);
          }}
          onCancel={() => setDetailsOpen(false)}
        />
      )}
    </div>
  );
};

export default Calendar;
