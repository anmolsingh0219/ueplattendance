import { useRecoilState, useRecoilValue } from 'recoil';
import { currentStatusState, selectedDateState, attendanceState, inTimeState, outTimeState, projectsState } from './AppState';
import { employeeCodeState, employeeSearchTermState, dropdownVisibilityState } from './AppState';
import { useDisabledDates } from './UseDisableDates';

const appendDataToSheet = async (data, sheetId, range, accessToken) => {
  const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;
  const response = await fetch(sheetsUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [data],
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to append data to the sheet');
  }

  return await response.json();
};

const fetchDatesForEmployeeCode = async (employeeCode, accessToken) => {
  const sheetId = '1O-xjnt6OVgLdbsRp7q-3pHK06Q2MCcZGdm8ImKXHLPo';
  const range = 'Hours Logged!A3:E'; // Set this to the appropriate range in your sheet
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`;

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error('Failed to fetch sheet data');
    const data = await response.json();
    return data.values
      .filter(row => row[2] === employeeCode) // Assuming employee code is in the third column
      .map(row => row[1]); // Assuming date is in the second column
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // Return an empty array in case of an error
  }
};

const StatusSelector = () => {
  const [currentStatus, setCurrentStatus] = useRecoilState(currentStatusState);
  const [selectedDate, setSelectedDate] = useRecoilState(selectedDateState);
  const [attendance, setAttendance] = useRecoilState(attendanceState);
  const [inTime, setInTime] = useRecoilState(inTimeState);
  const [outTime, setOutTime] = useRecoilState(outTimeState);
  // const userEmail = useRecoilValue(userEmailState);
  const projects = useRecoilValue(projectsState);
  const [employeeCode, setEmployeeCode] = useRecoilState(employeeCodeState);
  const [searchTerm, setSearchTerm] = useRecoilState(employeeSearchTermState);
  const [isDropdownVisible, setIsDropdownVisible] = useRecoilState(dropdownVisibilityState); // Use the disabledDatesState
  const { setDisabledDates } = useDisabledDates();

  const handleEmployeeCodeSelect = async (code) => {
    setEmployeeCode(code);
    setSearchTerm(code); // Clear search term if needed
    setIsDropdownVisible(false); // Hide dropdown
    
    // Use the correct accessToken retrieval method
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      try {
        const fetchedDisabledDates = await fetchDatesForEmployeeCode(code, accessToken);
        setDisabledDates(fetchedDisabledDates.map(dateStr => {
          // Transform the date to the format expected by the calendar
          const [day, month, year] = dateStr.split(/[\s-]/);
          return new Date(`20${year}`, month - 1, day).toISOString().split('T')[0];
        }));
        console.log('Disabled Dates set:', fetchedDisabledDates);
      } catch (error) {
        console.error('Failed to fetch dates:', error);
      }
    }
  };


  const handleStatusChange = (e) => {
    setCurrentStatus(e.target.value);
  };

  const employeeCodes = ['U001', 'U002', 'U005', 'U007']; // Your employee codes
  const filteredEmployeeCodes = searchTerm
    ? employeeCodes.filter((code) =>
        code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : employeeCodes;

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setIsDropdownVisible(true); // Show dropdown when typing
  };

  const handleInputBlur = () => {
    // Optionally, you can hide the dropdown when the input loses focus
    // setTimeout is used to delay the hiding, ensuring that a click on a dropdown item is registered
    setTimeout(() => {
      setIsDropdownVisible(false);
    }, 100);
  };

  const handleSave  = async () => {
    if (selectedDate) {
      setAttendance({ ...attendance, [selectedDate]: currentStatus });
      setSelectedDate(null); // Clear the selected date after saving
      // ... existing logic to handle the status change
  
      const accessToken = localStorage.getItem('access_token'); // Access token from OAuth
      const sheetId = '1O-xjnt6OVgLdbsRp7q-3pHK06Q2MCcZGdm8ImKXHLPo'; // Replace with your actual Google Sheet ID
      const range = 'Hours Logged'; // Replace with your actual sheet name
  
      // ... rest of the function
  
      // Format the data to write to the Google Sheet
      const formattedDate = new Date(selectedDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      }).replace(/ /g, '');
      
      const uniqueCode = formattedDate + employeeCode; // Replace with your logic to create a unique code
  
      // Assuming 'projects' is an array of project objects with 'hours' property
      const projectHours = projects.map(project => project.hours);
  
      const data = [
        uniqueCode,
        formattedDate,
        employeeCode, // User's email
        inTime,
        outTime,
        ...projectHours,
      ];
  
      try {
        const response = await appendDataToSheet(data, sheetId, range, accessToken);
        console.log(response); // Log the response from the Google Sheets API
        // Here you can handle the UI update to confirm the data was saved
      } catch (error) {
        console.error('Error writing to the sheet:', error);
        // Here you can handle the UI update to show an error
      }
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
      <div className='flex-col items-start'>
        <div>Enter your Employee Code</div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search employee code"
            className="border p-2"
            value={searchTerm}
            onChange={handleSearchTermChange}
            onFocus={() => setIsDropdownVisible(true)}
            onBlur={handleInputBlur}
          />
          {isDropdownVisible && (
  <ul className="absolute border w-full z-10 bg-white text-black">
    {filteredEmployeeCodes.map((code) => (
      <li
        key={code}
        className="p-2 hover:bg-blue-200 cursor-pointer"
        onClick={() => handleEmployeeCodeSelect(code)}
        onMouseDown={(e) => e.preventDefault()} // Prevent the input from losing focus
      >
        {code}
      </li>
    ))}
  </ul>
)}
        </div>
       </div>
      <div className='p-3'>
      <button className="bg-blue-600 text-white py-2 px-4 text-lg rounded hover:bg-blue-700" onClick={handleSave}>
      Save
    </button>
    <button className="bg-red-600 text-white py-2 ml-2 text-lg rounded hover:bg-red-700" onClick={handleReset}>
      Reset
    </button>
      </div>
  </div>
  </div>
  );
};

export default StatusSelector;