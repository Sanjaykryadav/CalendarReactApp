import React, { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [events, setEvents] = useState({});

  const addEvent = (date, event) => {
    setEvents((prevEvents) => ({
      ...prevEvents,
      [date]: [...(prevEvents[date] || []), event],
    }));
  };


  const editEvent = (date, index, updatedEvent) => {
    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents[date]];
      updatedEvents[index] = updatedEvent;
      return {
        ...prevEvents,
        [date]: updatedEvents,
      };
    });
  };
  

  const deleteEvent = (date, index) => {
    setEvents((prevEvents) => {
      const updatedEvents = (prevEvents[date] || []).filter((_, i) => i !== index);
      return {
        ...prevEvents,
        [date]: updatedEvents.length ? updatedEvents : undefined,
      };
    });
  };

  return (
    <Context.Provider value={{ events, editEvent, addEvent, deleteEvent }}>
      {children}
    </Context.Provider>
  );
};
