var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function getSearchObject() {
  var search = {};
  window.location.search.slice(1).split('&').forEach(function (part) {
    var _part$split = part.split('='),
        _part$split2 = _slicedToArray(_part$split, 2),
        key = _part$split2[0],
        value = _part$split2[1];

    if (value && value !== '') {
      search[key] = value;
    }
  });
  console.log(search);
  return search;
}

function DayForm() {
  var today = new Date();

  var _getSearchObject = getSearchObject(),
      _getSearchObject$year = _getSearchObject.year,
      year = _getSearchObject$year === undefined ? today.getFullYear() : _getSearchObject$year,
      _getSearchObject$day = _getSearchObject.day,
      day = _getSearchObject$day === undefined ? Math.min(today.getDate(), 25) : _getSearchObject$day;

  return React.createElement(
    'form',
    { className: 'd-flex align-items-end' },
    React.createElement(
      'label',
      { className: 'me-2' },
      'Year:',
      React.createElement('input', { type: 'text', defaultValue: year, className: 'form-control mt-1', name: 'year' })
    ),
    React.createElement(
      'label',
      { className: 'me-2' },
      'Day:',
      React.createElement('input', { type: 'text', defaultValue: day, className: 'form-control  mt-1', name: 'day' })
    ),
    React.createElement('input', { type: 'submit', className: 'btn btn-light', value: 'Submit' })
  );
}

export default DayForm;