import React, { useReducer } from 'react';
import DayForm from './DayForm.js';
import DateSource from './DateSource.js';

function Controls() {
  const [useSampleData, toggleUseSampleData] = useReducer((f) => !f, true);
  return (
    <div>
      <DayForm />
      <DateSource useSampleData={useSampleData} toggleUseSampleData={toggleUseSampleData} />
    </div>
  );
}

export default Controls;
