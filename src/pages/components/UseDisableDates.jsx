// src/hooks/useDisabledDates.js
import { useContext } from 'react';
import { DisabledDatesContext } from './DisabledDates';

export const useDisabledDates = () => {
  const context = useContext(DisabledDatesContext);
  if (context === undefined) {
    throw new Error('useDisabledDates must be used within a DisabledDatesProvider');
  }
  return context;
};
