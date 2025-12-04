import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function TourStartDatePicker({
  availableDates,
  selectedDate,
  onChange,
}) {
  const shouldDisableDate = (dayjsDate) => {
    const date = dayjsDate.toDate();
    return !availableDates.some((d) => {
      const available = new Date(d);
      return (
        available.getDate() === date.getDate() &&
        available.getMonth() === date.getMonth() &&
        available.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Chọn ngày khởi hành"
        value={selectedDate}
        onChange={onChange}
        shouldDisableDate={shouldDisableDate}
        slotProps={{
          textField: {
            fullWidth: true,
            variant: "outlined",
          },
        }}
      />
    </LocalizationProvider>
  );
}
