var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import React, { useReducer } from 'react';
import DayForm from './DayForm.js';
import DateSource from './DateSource.js';

function Controls() {
  var _useReducer = useReducer(function (f) {
    return !f;
  }, true),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      useSampleData = _useReducer2[0],
      toggleUseSampleData = _useReducer2[1];

  return React.createElement(
    'div',
    null,
    React.createElement(DayForm, null),
    React.createElement(DateSource, { useSampleData: useSampleData, toggleUseSampleData: toggleUseSampleData })
  );
}

export default Controls;