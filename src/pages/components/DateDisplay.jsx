import { useRecoilValue } from 'recoil';
import { selectedDateState } from './AppState';
import { format } from 'date-fns';

const SelectedDateDisplay = () => {
  const selectedDate = useRecoilValue(selectedDateState);

  // Format the date to a readable format, e.g., "20th January 2024"
  const formattedDate = selectedDate ? format(new Date(selectedDate), 'do MMMM yyyy') : '';

  return (
    <div>
      {selectedDate && (
        <div className="text-lg font-semibold mb-4">
          <span>Date Selected: {formattedDate}</span>
        </div>
      )}
    </div>
  );
};

export default SelectedDateDisplay;
