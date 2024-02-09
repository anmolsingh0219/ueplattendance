// DisabledDatesContext.js

import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const DisabledDatesContext = createContext();

export const DisabledDatesProvider = ({ children }) => {
    const [disabledDates, setDisabledDates] = useState([]);

    return (
        <DisabledDatesContext.Provider value={{ disabledDates, setDisabledDates }}>
            {children}
        </DisabledDatesContext.Provider>
    );
};

DisabledDatesProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
