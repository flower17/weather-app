import React from 'react';
import PropTypes from 'prop-types';

import { getDateString } from './helpers';

import './date-string.scss';

const DateString = props => {
   console.log('DateString keepcomma', props.keepComma);
    return (
        <div className="date-string">
            {getDateString(props.seconds, undefined, props.keepComma)}
        </div>
    );
}

DateString.propTypes = {
    date: 			PropTypes.number,
    keepComma:      PropTypes.bool,
};

export default DateString;