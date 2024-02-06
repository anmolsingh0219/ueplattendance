import { atom } from 'recoil';

export const attendanceState = atom({
  key: 'attendanceState',
  default: {},
});

export const selectedDateState = atom({
  key: 'selectedDateState',
  default: null,
});

export const currentStatusState = atom({
  key: 'currentStatusState',
  default: 'Present',
});

export const selectedDateDisplayState = atom({
  key: 'selectedDateDisplayState',
  default: '', // default value can be an empty string
});

export const inTimeState = atom({
  key: 'inTimeState',
  default: '09:00',
});

export const outTimeState = atom({
  key: 'outTimeState',
  default: '17:00',
});

export const projectsState = atom({
  key: 'projectsState',
  default: [
    { code: 'SD', name: 'Self Development', hours: 0 },
    { code: 'DD', name: 'Departmental Development', hours: 0 },
    // ... add more projects as needed
  ],
});

export const projectsLoadingState = atom({
  key: 'projectsLoadingState',
  default: true,
});

export const userEmailState = atom({
  key: 'userEmailState',
  default: '',
});

export const employeeCodeState = atom({
  key: 'employeeCodeState',
  default: '', 
});

export const employeeSearchTermState = atom({
  key: 'employeeSearchTermState',
  default: '',
});

export const dropdownVisibilityState = atom({
  key: 'dropdownVisibilityState',
  default: false,
});