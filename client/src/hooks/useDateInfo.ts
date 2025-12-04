import { useMemo } from "react";

export function useDateInfo() {
  return useMemo(() => {
    const newDate = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return {
      dayName: days[newDate.getDay()],
      day: newDate.getDate(),
      month: months[newDate.getMonth()],
      year: newDate.getFullYear(),
      iso: newDate.toISOString(),
      date: newDate,
    };
  }, []);
}
