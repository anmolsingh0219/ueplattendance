import { useEffect, useState } from 'react';

export const LeaveDashboard = () => {
  const [leaveData, setLeaveData] = useState({
    totalAllotted: 0,
    totalTaken: 0,
    leaveBalance: 0,
  });

  useEffect(() => {
    // Simulate fetching data
    setLeaveData({
      totalAllotted: 26,
      totalTaken: 6,
      leaveBalance: 20,
    });
  }, []);

  return (
    <div className="p-6 bg-white text-gray-800 text-lg rounded-lg shadow-lg">
  <h2 className="text-xl text-black font-semibold mb-2">Leave Dashboard</h2>
  <div className="mb-1 text-black">Total Allotted: {leaveData.totalAllotted}</div>
  <div className="mb-1 text-black">Total Taken: {leaveData.totalTaken}</div>
  <div className="mb-1 text-black">Leave Balance: {leaveData.leaveBalance}</div>
</div>
  );
};
