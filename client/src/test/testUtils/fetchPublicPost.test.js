import '@testing-library/jest-dom';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();
const lib = require('../../utils/fetchPublicPost');

describe('fetchPublicPost', () => {
  test('fetchPopularPost', async () => {
    fetch.mockResponse(JSON.stringify(
      [{ id: '001', author: 'wrf' }],
    ));
    const data = await lib.fetchPopularPost();
    expect(data[0].id).toBe('001');
  });

  test('fetchPost', async () => {
    fetch.mockResponse(JSON.stringify(
      { id: '01', author: 'wrf' },
    ));
    const data = await lib.fetchPost('01');
    expect(data.author).toBe('wrf');
  });

  test('commentPost', async () => {
    const data = await lib.commentPost('01', 'wrf', 'comment', 'group');
    expect(data).toBe(200);
  });

  test('deleteComment', async () => {
    const data = await lib.deleteComment('01', 'wrf', '20210507');
    expect(data).toBe(200);
  });

  test('flagForDeletion', async () => {
    const data = await lib.flagForDeletion('01', 'wrf');
    expect(data).toBe(200);
  });

  test('unflagForDeletion', async () => {
    const data = await lib.unflagForDeletion('01', 'wrf');
    expect(data).toBe(200);
  });

  test('fetchPopularPostId', async () => {
    fetch.mockResponse(JSON.stringify(
      [{ id: '001' }],
    ));
    const data = await lib.fetchPopularPostId('01', 'wrf');
    expect(data[0].id).toBe('001');
  });
});
