"use client";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import { DateContext } from "@contexts/DateContext";

function DateCom() {
  const { selectedDate, setSelectedDate } = useContext(DateContext);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledStaticDatePicker
        disabled={!setSelectedDate}
        value={selectedDate}
        onChange={(newValue) => {
          if (newValue && setSelectedDate) setSelectedDate(newValue);
        }}
        sx={{ minWidth: 1, background: "#44406a" }}
      />
    </LocalizationProvider>
  );
}

export default DateCom;

const StyledStaticDatePicker = styled(StaticDatePicker)({
  ".MuiDateCalendar-root": {
    width: "288px",
    backgroundColor: "#44406a",
    color: "white",
  },
  ".MuiPickersToolbar-root": {
    display: "none",
  },
  ".MuiPickersDay-root.MuiPickersDay-today": {
    border: "1px solid #ffb074",
  },
  ".MuiPickersDay-root": {
    color: "white",
  },
  ".MuiPickersYear-root, .MuiPickersMonth-root": {
    color: "white",
  },
  ".MuiPickersSlideTransition-root": {
    color: "white",
  },
  ".MuiIconButton-root": {
    color: "white",
  },
  ".MuiButton-root": {
    display: "none",
  },
  ".MuiDayCalendar-weekDayLabel": {
    color: "white",
  },
  ".MuiPickersDay-root.Mui-selected": {
    backgroundColor: "#ffb074",
    color: "white",
  },
});
