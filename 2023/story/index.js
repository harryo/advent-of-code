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
  const doc = parser.parseFromString(data, 'text/html');
  const dayDesc = doc.getElementsByClassName('day-desc')[0];
  const children = Array.from(dayDesc.childNodes);
  dayDesc.setAttribute('id', `day-${day}`);
  let remove = false;
  children.forEach((child) => {
    const text = child.textContent;
    if (text.includes('your puzzle input') || text.endsWith(':')) {
      remove = true;
    }
    if (remove) {
      dayDesc.removeChild(child);
    }
  });
  return dayDesc;
}

async function getAllDays() {
  const storyDiv = parser.parseFromString('<div></div>', 'text/html').getElementsByTagName('div')[0];
  for (let i = 1; i < 26; i++) {
    console.log('Getting day', i);
    // eslint-disable-next-line no-await-in-loop
    const story = await getStory(i);
    storyDiv.appendChild(story);
  }
  const storyHtml = new XMLSerializer().serializeToString(storyDiv)
    .replace(' xmlns="http://www.w3.org/1999/xhtml"', ' id="story"');
  const template = await fs.readFile(join(dir, 'template.html'), 'utf8');
  await fs.writeFile(join(dir, 'story.html'), template.replace('<!--STORY-->', storyHtml));
  console.log('Done, read story.html');
}

getAllDays();
