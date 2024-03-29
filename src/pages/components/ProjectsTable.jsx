import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { projectsState, projectsLoadingState, inTimeState, outTimeState } from './AppState';



const ProjectsTable = () => {
  const [projects, setProjects] = useRecoilState(projectsState);
  const [loading, setLoading] = useRecoilState(projectsLoadingState);
  const inTime = useRecoilValue(inTimeState);
  const outTime = useRecoilValue(outTimeState);

  const loadSheetData = async () => {
    const accessToken = localStorage.getItem('access_token'); // Get the access token from local storage
    const sheetId = '1O-xjnt6OVgLdbsRp7q-3pHK06Q2MCcZGdm8ImKXHLPo'; // Replace with your actual sheet ID
    const range = 'Project!A2:C'; 
  
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to fetch data from the sheet');
      }
  
      const data = await response.json();
      return data.values; // This will be an array of arrays with your data
    } catch (error) {
      console.error('Error fetching data from the sheet:', error);
      return []; // Return an empty array in case of error
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
  
      try {
        const sheetData = await loadSheetData();
        
        // Filter the data to only include rows where the status is "Live"
        const liveProjectsData = sheetData.filter(row => row[2] === 'Live').map((row, index) => ({
          id: index + 1, // Sr. No. is just the index + 1
          code: row[0], // Project code is assumed to be in the first column
          name: row[1], // Project name is assumed to be in the second column
          hours: 0, // Initialize hours as 0 for the input
        }));
  
        setProjects(liveProjectsData);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [setProjects, setLoading]);

  const calculateTotalAvailableHours = () => {
    const [inHours, inMinutes] = inTime.split(':').map(Number);
    const [outHours, outMinutes] = outTime.split(':').map(Number);
    return (outHours + outMinutes / 60) - (inHours + inMinutes / 60);
  };

  const totalAvailableHours = calculateTotalAvailableHours();

  const validateAndSetHours = (projectIndex, newHours) => {
    const numericNewHours = newHours ? parseFloat(newHours) : 0;
    const totalHours = projects.reduce((acc, project, index) => {
      return acc + (index === projectIndex ? numericNewHours : parseFloat(project.hours || 0));
    }, 0);

    if (totalHours <= totalAvailableHours) {
      const updatedProjects = projects.map((project, index) => {
        if (index === projectIndex) {
          return { ...project, hours: numericNewHours };
        }
        return project;
      });
      setProjects(updatedProjects);
    } else {
      // Handle the error case appropriately
      console.error('Total project hours exceed available hours.');
    }
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className="bg-white rounded overflow-auto max-h-200 max-w-100">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="p-4 border-b text-black">Sr. No.</th>
            <th className="p-4 border-b text-black">Project Code</th>
            <th className="p-4 border-b text-black">Project</th>
            <th className="p-4 border-b text-black">Hours clocked in</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td className="p-4 border-b text-center text-black">{index + 1}</td>
              <td className="p-4 border-b text-center text-black">{project.code}</td>
              <td className="p-4 border-b text-black">{project.name}</td>
              <td className="p-4 border-b text-black">
                <input
                  type="number"
                  className="form-input bg-white text-black"
                  value={project.hours}
                  onChange={(e) => validateAndSetHours(index, e.target.value)}
                  min="0"
                  max={totalAvailableHours}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;
