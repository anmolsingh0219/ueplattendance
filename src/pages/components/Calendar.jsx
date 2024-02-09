import ReactCalendar from 'react-calendar';
import { useRecoilState } from 'recoil';
import { attendanceState, currentStatusState, selectedDateState } from './AppState';
import 'react-calendar/dist/Calendar.css'; // Default styling, can be overridden
import { useDisabledDates } from './UseDisableDates';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useRecoilState(selectedDateState);
  const [attendance, setAttendance] = useRecoilState(attendanceState);
  const [currentStatus] = useRecoilState(currentStatusState);
  const { disabledDates } = useDisabledDates(); // Get the disabled dates from Recoil state

  const holidays = [
    '2024-01-01',
    '2024-01-26',
    '2024-03-25',
    '2024-08-15',
    '2024-08-19',
    '2024-09-16',
    '2024-10-10',
    '2024-10-31',
    '2024-11-01',
    '2024-12-25',
  ];

  const handleDayClick = (value) => {
    // Manually construct the date string in 'YYYY-MM-DD' format
    const year = value.getFullYear();
    const month = (value.getMonth() + 1).toString().padStart(2, '0'); // JS months are 0-indexed
    const day = value.getDate().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    setSelectedDate(dateStr); // Update the selected date state
    setAttendance({
      ...attendance,
      [dateStr]: currentStatus,
    });
  };

  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      // Same manual construction for comparison
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      return disabledDates.includes(dateStr);
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      // Again, construct the date string manually
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const status = attendance[dateStr];
      let classes = [];

      if (holidays.includes(dateStr)) {
        classes.push('react-calendar__tile--holiday');
      }

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
        tileDisabled={tileDisabled}
        // You can also pass additional TailwindCSS classes to the calendar via the 'className' prop if necessary
      />
    </div>
  );
};

export default Calendar;
