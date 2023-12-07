import DayForm from './DayForm.js';

function App() {
  return React.createElement(
    'div',
    null,
    React.createElement(DayForm, null)
  );
}
var domContainer = document.querySelector('#root');
var root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(App, null));