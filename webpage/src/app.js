import DayForm from './DayForm.js';

function App() {
  return (
    <div>
      <DayForm />
    </div>
  );
}
const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(<App />);