import '@testing-library/jest-dom';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();
const lib = require('../../utils/uploadPost');

describe('uploadPost', () => {
  test('uploadPublicPost', async () => {
    fetch.mockResponse(JSON.stringify(
      '001',
    ));
    const file = new Blob([JSON.stringify({ name: 'file.jpg' }, null, 2)], { type: 'application/json' });
    const input = {
      group: 'group', author: 'author', title: 'title', content: 'content', file,
    };
    await lib.uploadPublicPost(input);
  });

  test('uploadPrivatePost', async () => {
    fetch.mockResponse(JSON.stringify(
      '001',
    ));
    const file = new Blob([JSON.stringify({ name: 'file.jpg' }, null, 2)], { type: 'application/json' });
    const input = {
      group: 'group', author: 'author', title: 'title', content: 'content', file,
    };
    await lib.uploadPrivatePost(input);
  });
});
