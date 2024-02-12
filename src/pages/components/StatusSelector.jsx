import { useRecoilState, useRecoilValue } from 'recoil';
import { currentStatusState, selectedDateState, attendanceState, inTimeState, outTimeState, projectsState } from './AppState';
import { useDisabledDates } from './UseDisableDates';
import { useEffect, useState } from 'react';

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

const fetchEmployeeCodeByEmail = async (email, accessToken) => {
  const sheetId = '1O-xjnt6OVgLdbsRp7q-3pHK06Q2MCcZGdm8ImKXHLPo'; // Replace with your actual Google Sheet ID
  const range = 'Email!A2:B'; // e.g., 'EmployeeMapping!A:B' where A column is email and B is code
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`;

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error('Failed to fetch sheet data');
    const data = await response.json();
    const rows = data.values || [];
    const matchingRow = rows.find(row => row[0] === email);
    return matchingRow ? matchingRow[1] : null; // Return employee code or null if not found
  } catch (error) {
    console.error('Error fetching employee code:', error);
    return null;
  }
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
  const projects = useRecoilValue(projectsState);// Use the disabledDatesState
  const { setDisabledDates } = useDisabledDates();
  const [employeeCode, setEmployeeCode] = useState('');

  useEffect(() => {
    const initializeComponent = async () => {
      const accessToken = localStorage.getItem('access_token');
      const email = localStorage.getItem('user_email');
      if (accessToken && email) {
        const code = await fetchEmployeeCodeByEmail(email, accessToken);
        setEmployeeCode(code);

    if (code) {
      const accessToken = localStorage.getItem('access_token');
      fetchDatesForEmployeeCode(code, accessToken)
        .then(fetchedDisabledDates => {
          const formattedDates = fetchedDisabledDates.map(dateStr => {
            const dateParts = dateStr.match(/(\d{2})(\w{3})(\d{2})/);
            const date = new Date(`20${dateParts[3]}`, new Date(`${dateParts[2]} 01 2000`).getMonth(), dateParts[1]);
            return date.toISOString().split('T')[0];
          });
          setDisabledDates(formattedDates);
        })
        .catch(error => console.error('Failed to fetch dates:', error));
      }
    }
  };

  initializeComponent();
}, []);


  const handleStatusChange = (e) => {
    setCurrentStatus(e.target.value);
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
   // Generate time options for the dropdown
   const timeOptions = Array.from({ length: 96 }, (_, index) => {
    const hour = Math.floor(index / 4);
    const minutes = (index % 4) * 15;
    return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
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
      <div className='font-semibold'>Your Employee Code: {employeeCode}</div>
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