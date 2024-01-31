import { useRecoilState } from 'recoil';
import { currentStatusState, selectedDateState, attendanceState, inTimeState, outTimeState  } from './AppState';

const StatusSelector = () => {
  const [currentStatus, setCurrentStatus] = useRecoilState(currentStatusState);
  const [selectedDate, setSelectedDate] = useRecoilState(selectedDateState);
  const [attendance, setAttendance] = useRecoilState(attendanceState);
  const [inTime, setInTime] = useRecoilState(inTimeState);
  const [outTime, setOutTime] = useRecoilState(outTimeState);


  const handleStatusChange = (e) => {
    setCurrentStatus(e.target.value);
  };

  const handleSave = () => {
    if (selectedDate) {
      setAttendance({ ...attendance, [selectedDate]: currentStatus });
      setSelectedDate(null); // Clear the selected date after saving
    }
  };

  const handleInTimeChange = (e) => {
    setInTime(e.target.value);
  };

  const handleOutTimeChange = (e) => {
    setOutTime(e.target.value);
  };
  
  const handleReset = () => {
    setCurrentStatus('Present');
    setInTime('');
    setOutTime('');
  };

  // Calculate total hours (very simplified version, assuming times are in 'HH:mm' format)
  const calculateTotalHours = () => {
    if (!inTime || !outTime) return 0;
    const [inHours, inMinutes] = inTime.split(':').map(Number);
    const [outHours, outMinutes] = outTime.split(':').map(Number);
    return (outHours + outMinutes / 60) - (inHours + inMinutes / 60);
  };

  const totalHours = calculateTotalHours();

  // Generate time options for the dropdown
  const timeOptions = Array.from({ length: 48 }, (_, index) => {
    const hour = Math.floor(index / 2);
    const minute = index % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });
  

  return (
    <div className="flex flex-col space-x-3 ">
    <div className='flex flex-row space-x-4 p-3 '>
    <label className="inline-flex items-center">
      <input type="radio" className="form-radio" name="status" value="Present" onChange={handleStatusChange} checked={currentStatus === 'Present'} />
      <span className="ml-2">Present</span>
    </label>
    <label className="inline-flex items-center">
      <input type="radio" className="form-radio" name="status" value="Paid Leave" onChange={handleStatusChange} checked={currentStatus === 'Paid Leave'} />
      <span className="ml-2">Paid Leave</span>
    </label>
    <label className="inline-flex items-center">
      <input type="radio" className="form-radio" name="status" value="Absent" onChange={handleStatusChange} checked={currentStatus === 'Absent'} />
      <span className="ml-2">Half day</span>
    </label> 
    </div>
    <div className="flex-col space-x-3 space-y-5">
    <div className="flex space-x-3">
        <select className="form-select bg-white text-black" value={inTime} onChange={handleInTimeChange}>
          {timeOptions.map((time) => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
        <select className="form-select bg-white text-black" value={outTime} onChange={handleOutTimeChange}>
          {timeOptions.map((time) => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
        <div>Total Hours: {totalHours.toFixed(2)}</div>
      </div>
      <div className='p-3'>
      <button className="bg-blue-600 text-white py-2 px-4 text-lg rounded hover:bg-blue-700" onClick={handleSave}>
      Save
    </button>
    <button className="bg-red-600 text-white py-2 px-4 text-lg rounded hover:bg-red-700" onClick={handleReset}>
      Reset
    </button>
      </div>
  </div>
  </div>
  );
};

export default StatusSelector;
