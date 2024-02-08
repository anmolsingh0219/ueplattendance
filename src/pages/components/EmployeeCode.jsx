// src/components/EmployeeCodeSelection.jsx
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { employeeCodeState, employeeSearchTermState, dropdownVisibilityState } from './AppState';

const EmployeeCodeSelection = () => {
  const navigate = useNavigate();
  const setEmployeeCode = useSetRecoilState(employeeCodeState);
  const [searchTerm, setSearchTerm] = useRecoilState(employeeSearchTermState);
  const [isDropdownVisible, setIsDropdownVisible] = useRecoilState(dropdownVisibilityState);
  const employeeCodes = ['U001', 'U002', 'U005', 'U007']; // Your employee codes
  
  const filteredEmployeeCodes = searchTerm
    ? employeeCodes.filter((code) =>
        code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : employeeCodes;

    const handleEmployeeCodeSelect = (code) => {
      setEmployeeCode(code); // Set the selected employee code
      setSearchTerm(code); // Update the searchTerm with the full code (e.g., "U005")
      setIsDropdownVisible(false);
      console.log("Employee code set to:", code);
      navigate('/homepage'); // Hide dropdown after selection
    };

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

  return (
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
  );
};

export default EmployeeCodeSelection;
