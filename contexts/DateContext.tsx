"use client";
import dayjs, { Dayjs } from "dayjs";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export const DateContext = createContext<{
  selectedDate: Dayjs;
  setSelectedDate?: Dispatch<SetStateAction<dayjs.Dayjs>>;
}>({
  selectedDate: dayjs(),
});

export const DateProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
};
