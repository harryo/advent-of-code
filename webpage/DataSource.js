import React from 'react';
import PropTypes from 'prop-types';

function DataSource(props) {
  var useSampleData = props.useSampleData,
      toggleUseSampleData = props.toggleUseSampleData;

  var sources = [{ id: 'source-sample', label: 'Sample data', checked: useSampleData }, { id: 'source-input', label: 'Input data', checked: !useSampleData }];
  return React.createElement(
    'fieldset',
    { className: 'mb-4' },
    React.createElement(
      'legend',
      null,
      'Data Source'
    ),
    sources.map(function (_ref) {
      var id = _ref.id,
          label = _ref.label,
          checked = _ref.checked;
      return React.createElement(
        'div',
        { className: 'form-check' },
        React.createElement('input', { className: 'form-check-input', type: 'radio', name: 'source', id: id, checked: checked }),
        React.createElement(
          'label',
          { className: 'form-check-label', htmlFor: id },
          label
        )
      );
    })
  );
}

DataSource.propTypes = {
  useSampleData: PropTypes.bool.isRequired,
  toggleUseSampleData: PropTypes.func.isRequired
};
export default DataSource;