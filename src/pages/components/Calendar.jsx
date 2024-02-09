import ReactCalendar from 'react-calendar';
import { useRecoilState } from 'recoil';
import { attendanceState, currentStatusState, selectedDateState} from './AppState';
import 'react-calendar/dist/Calendar.css'; // Default styling, can be overridden
import { useDisabledDates } from './UseDisableDates';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useRecoilState(selectedDateState);
  const [attendance, setAttendance] = useRecoilState(attendanceState);
  const [currentStatus] = useRecoilState(currentStatusState);
  const { disabledDates } = useDisabledDates();// Get the disabled dates from Recoil state

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
    const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds

  // Create a date string with the local time adjusted for IST timezone
  const localDate = new Date(value.getTime() + IST_OFFSET);
  const dateStr = localDate.toISOString().split('T')[0];
  setSelectedDate(dateStr); // Update the selected date state
    setAttendance({
     ...attendance,
     [dateStr]: currentStatus,
    });
    };

  const tileDisabled = ({ date, view }) => {
    console.log('Disabled Dates received:', disabledDates);
    // Disable tiles in 'month' view only
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      console.log(`Is date disabled? Date: ${dateStr}, Disabled: ${disabledDates.includes(dateStr)}`);
      return disabledDates.includes(dateStr); // Check if the date should be disabled
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const status = attendance[dateStr];
      let classes = [];

      if (holidays.includes(dateStr)) {
        classes.push('react-calendar__tile--holiday');
      }
      
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
      tileDisabled={tileDisabled}
      // You can also pass additional TailwindCSS classes to the calendar via the 'className' prop if necessary
    />
  </div>
  );
};

export default Calendar;
