import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Label } from './ui/label.jsx';

const YEAR = 'year';
const DAY = 'day';

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
    <form className="w-32">
      <div>
        <Label htmlFor={YEAR}>Year:</Label>
        <Input type="text" defaultValue={year} className="" id={YEAR} />
      </div>
      <div className="w-20">
        <Label htmlFor={DAY}>Day:</Label>
        <Input type="text" defaultValue={day} className="" id={DAY} />
      </div>
      <Button type="submit" className="btn btn-light" value="Submit">
        Submit
      </Button>
    </form>
  );
}

export default DayForm;
