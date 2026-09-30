import test from 'node:test';
import assert from 'node:assert/strict';
import { splitLegalContent } from '../src/lib/legal-sections.ts';

test('preserves introductions, numbered headings and bullet text', () => {
 const result = splitLegalContent('Intro\n\n1. Privacy\n• Name\n• Email\n\nMore detail\n\n2. Contact\nContact us');
 assert.deepEqual(result.intro, ['Intro']);
 assert.equal(result.sections.length, 2);
 assert.deepEqual(result.sections[0], {id:'section-1',heading:'1. Privacy',paragraphs:['• Name\n• Email','More detail']});
 assert.equal(result.sections[1].id, 'section-2');
});
test('handles empty and unstructured content without dropping it', () => {
 assert.deepEqual(splitLegalContent(''), {intro:[],sections:[]});
 assert.deepEqual(splitLegalContent('First\r\n\r\nSecond'), {intro:['First','Second'],sections:[]});
});
