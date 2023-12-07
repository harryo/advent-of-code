import React from 'react';
import PropTypes from 'prop-types';

function DataSource(props) {
  const { useSampleData, toggleUseSampleData } = props;
  const sources = [
    { id: 'source-sample', label: 'Sample data', checked: useSampleData },
    { id: 'source-input', label: 'Input data', checked: !useSampleData },
  ];
  return (
    <fieldset className="mb-4">
      <legend>Data Source</legend>
      {sources.map(({ id, label, checked }) => (
        <div className="form-check">
          <input className="form-check-input" type="radio" name="source" id={id} checked={checked} />
          <label className="form-check-label" htmlFor={id}>
            {label}
          </label>
        </div>
      ))}
    </fieldset>
  );
}

DataSource.propTypes = {
  useSampleData: PropTypes.bool.isRequired,
  toggleUseSampleData: PropTypes.func.isRequired,
};
export default DataSource;
