import ReactCalendar from 'react-calendar';
import { useRecoilState } from 'recoil';
import { attendanceState, currentStatusState, selectedDateState } from './AppState';
import 'react-calendar/dist/Calendar.css'; // Default styling, can be overridden

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useRecoilState(selectedDateState);
  const [attendance, setAttendance] = useRecoilState(attendanceState);
  const [currentStatus] = useRecoilState(currentStatusState);

  const handleDayClick = (value) => {
    const dateStr = value.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    setSelectedDate(dateStr); // Update the selected date state
    // Update the attendance state for the clicked date with the current status
    setAttendance({
      ...attendance,
      [dateStr]: currentStatus,
    });
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const status = attendance[dateStr];
      let classes = [];
      
      // Using the custom CSS classes from index.css
      if (status === 'Present') {
        classes.push('react-calendar__tile--Present');
      } else if (status === 'Paid Leave') {
        classes.push('react-calendar__tile--PaidLeave');
      } else if (status === 'Absent') {
        classes.push('react-calendar__tile--Absent');
      }
      
      if (selectedDate === dateStr) {
        classes.push('ring-2 ring-black'); // Highlight the selected date
      }

      return classes.length ? classes.join(' ') : null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-white text-black">
    <ReactCalendar
      className="customCalendar"
      onClickDay={handleDayClick}
      tileClassName={tileClassName}
      // You can also pass additional TailwindCSS classes to the calendar via the 'className' prop if necessary
    />
  </div>
  );
};

export default Calendar;
