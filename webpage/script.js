const context = {};

function handleSubmit(ev) {
  ev.preventDefault();
  console.log(ev);
  const f = ev.target;
  console.dir(f);
}

function init() {
  const f = document.querySelector('form');
  f.addEventListener('submit', handleSubmit);
  console.log('Script loaded');
  console.log(window.location);
  handleImport();
}

function parseSearch() {
  const { search } = window.location;
  const data = {};
  search.split('&').forEach((part) => {
    const [key, value] = part.split('=');
    data[key] = value;
  });
  return data;
}

function step(...args) {
  console.log('Step', ...args);
}

window.step = step;

async function handleImport() {
  console.log('Import loaded');
  const { year, day } = parseSearch();
  const base = `../${year}/day${day}/`;
  context.sample = await fetch(`${base}sample.txt`).then((r) => r.text());
  context.input = await fetch(`${base}input.txt`).then((r) => r.text());
  context.functions = await import(`${base}index.js`);
  console.log(year, day, context);
}

document.addEventListener('DOMContentLoaded', init);
