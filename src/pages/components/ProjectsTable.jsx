import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { projectsState, projectsLoadingState, inTimeState, outTimeState } from './AppState';

const ProjectsTable = () => {
  const [projects, setProjects] = useRecoilState(projectsState);
  const [loading, setLoading] = useRecoilState(projectsLoadingState);
  const inTime = useRecoilValue(inTimeState);
  const outTime = useRecoilValue(outTimeState);

  const PROJECTS_URL = 'https://script.google.com/macros/s/AKfycbyqO9Llq-3Zfr-7tBNyyPhSQNNEugmYogGs4HentafOo7_Lsvz8xyPQnby7EcXhNrZTzA/exec?action=getProjects';


  // const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
  // const PROJECTS_URL = `${PROXY_URL}https://script.google.com/macros/s/AKfycbxsmJ4XyQBNiBfhXasqj8GPJ5baETLMo8ycbMtJfcV_MljSYg5lfkUqHkgUwbqfHLqofw/exec?action=getProjects`;


  // Endpoint URL for the Google Apps Script Web App
  // const PROJECTS_URL = 'https://script.google.com/macros/s/AKfycbxsmJ4XyQBNiBfhXasqj8GPJ5baETLMo8ycbMtJfcV_MljSYg5lfkUqHkgUwbqfHLqofw/exec?action=getProjects';

  useEffect(() => {
    setLoading(true);
    fetch(PROJECTS_URL)
      .then((response) => response.json())
      .then((data) => {
        setProjects(data.map((item, index) => ({ ...item, hours: 0, id: index + 1 })));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      });
  }, [PROJECTS_URL,setProjects, setLoading]);

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
    <div className="bg-white rounded overflow-auto max-h-64">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="p-3 border-b text-black">Sr. No.</th>
            <th className="p-3 border-b text-black">Project Code</th>
            <th className="p-3 border-b text-black">Project</th>
            <th className="p-3 border-b text-black">Hours clocked in</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td className="p-3 border-b text-center text-black">{index + 1}</td>
              <td className="p-3 border-b text-center text-black">{project.code}</td>
              <td className="p-3 border-b text-black">{project.name}</td>
              <td className="p-3 border-b text-black">
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
