import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState,useRecoilState } from 'recoil';
import { employeeCodeState, employeeSearchTermState, dropdownVisibilityState } from './AppState';

const EmployeeCodeSelection = () => {
  const navigate = useNavigate();
  const setEmployeeCode = useSetRecoilState(employeeCodeState);
  const [selectedEmployeeCode, setSelectedEmployeeCode] = useState(""); // Local state for selected code
  const [searchTerm, setSearchTerm] = useRecoilState(employeeSearchTermState);
  const [isDropdownVisible, setIsDropdownVisible] = useRecoilState(dropdownVisibilityState);
  const employeeCodes = ['U001', 'U002', 'U005', 'U007'];

  const filteredEmployeeCodes = searchTerm
    ? employeeCodes.filter((code) =>
        code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : employeeCodes;

  useEffect(() => {
    if (selectedEmployeeCode) {
      // Whenever selectedEmployeeCode changes and it's not empty, update the global state
      setEmployeeCode(selectedEmployeeCode);
      console.log("Employee code set to:", selectedEmployeeCode);
      // Optionally, perform other actions here if needed before navigating
      navigate('/homepage');
    }
  }, [selectedEmployeeCode, setEmployeeCode, navigate]); // Depend on selectedEmployeeCode to trigger

  const handleEmployeeCodeSelect = (code) => {
    setSelectedEmployeeCode(code); // Update local state, which triggers useEffect
    setSearchTerm(''); // Optionally clear or keep the search term
    setIsDropdownVisible(false);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setIsDropdownVisible(true);
  };

  const handleInputBlur = () => {
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
                  onMouseDown={(e) => e.preventDefault()}
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
