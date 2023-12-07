
function Controls() {
  var today = new Date();

  var _getSearchObject = getSearchObject(),
      _getSearchObject$year = _getSearchObject.year,
      year = _getSearchObject$year === undefined ? today.getFullYear() : _getSearchObject$year,
      _getSearchObject$day = _getSearchObject.day,
      day = _getSearchObject$day === undefined ? Math.min(today.getDate(), 25) : _getSearchObject$day;

  return React.createElement(
    "form",
    { className: "d-flex align-items-end" },
    React.createElement(
      "label",
      { className: "me-2" },
      "Year:",
      React.createElement("input", { type: "text", defaultValue: year, className: "form-control mt-1", name: "year" })
    ),
    React.createElement(
      "label",
      { className: "me-2" },
      "Day:",
      React.createElement("input", { type: "text", defaultValue: day, className: "form-control  mt-1", name: "day" })
    ),
    React.createElement("input", { type: "submit", className: "btn btn-light", value: "Submit" })
  );
}

export default Controls;