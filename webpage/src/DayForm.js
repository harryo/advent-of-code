import React from 'react';

function getSearchObject() {
  const search = {};
  window.location.search.slice(1).split('&').forEach((part) => {
    const [key, value] = part.split('=');
    if (value && value !== '') {
      search[key] = value;
    }
  });
  console.log(search);
  return search;
}

function DayForm() {
  const today = new Date();
  const { year = today.getFullYear(), day = Math.min(today.getDate(), 25) } = getSearchObject();
  return (
    <form className="d-flex align-items-end">
      <label htmlFor="year" className="me-2">
        Year:
        <input type="text" defaultValue={year} className="form-control mt-1" name="year" />
      </label>
      <label htmlFor="day" className="me-2">
        Day:
        <input type="text" defaultValue={day} className="form-control  mt-1" name="day" />
      </label>
      <input type="submit" className="btn btn-light" value="Submit" />
    </form>
  );
}

export default DayForm;
