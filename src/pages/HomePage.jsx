import Calendar from './components/Calendar';
import StatusSelector from './components/StatusSelector';
// import { LeaveDashboard } from './components/LeaveDashboard';
import ProjectsTable from './components/ProjectsTable';
import SelectedDateDisplay from './components/DateDisplay';
import { RecoilRoot } from 'recoil';


const HomePage = () => {
  return (
     <RecoilRoot>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-6">
        <h1 className="text-4xl font-bold mb-8">Attendance Tracker</h1>
        <div className="flex flex-wrap justify-around">
          <div className="rounded ">
            <Calendar />
          </div>
          <div className="flex flex-col items-start p-3">
            <SelectedDateDisplay />
            <StatusSelector />
          </div>
          <div className="flex flex-col items-start p-3">
            <ProjectsTable />
          </div>
        </div>
      </div>
    </RecoilRoot>
  );
};

export default HomePage;