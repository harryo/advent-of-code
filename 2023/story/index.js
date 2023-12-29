import fetch from 'node-fetch';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import fs from 'fs/promises';
import { dirname, join } from 'path';

const dir = dirname(new URL(import.meta.url).pathname);

const baseURL = 'https://adventofcode.com/2023/day/';
const parser = new DOMParser({ errorHandler: () => {} });

async function getStory(day) {
  const response = await fetch(baseURL + day);
  const data = await response.text();
  const doc = parser.parseFromString(data);
  const dayDesc = doc.getElementsByClassName('day-desc')[0];
  const children = Array.from(dayDesc.childNodes);
  let remove = false;
  children.forEach((child) => {
    if (remove) {
      dayDesc.removeChild(child);
    }
    const text = child.textContent;
    if (text.includes('your puzzle input') || text.endsWith(':')) {
      remove = true;
    }
  });
  return dayDesc;
}

async function getTemplate() {
  const html = await fs.readFile(join(dir, 'template.html'), 'utf8');
  return parser.parseFromString(html);
}

async function getAllDays() {
  const template = await getTemplate();
  const main = template.getElementById('the-story');
  for (let i = 1; i < 26; i++) {
    console.log('Getting day', i);
    // eslint-disable-next-line no-await-in-loop
    const story = await getStory(i);
    main.appendChild(story);
  }
  const storyHtml = new XMLSerializer().serializeToString(template);
  await fs.writeFile(join(dir, 'story.html'), storyHtml);
  console.log('Done, read story.html');
}

getAllDays();
