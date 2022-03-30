import '@testing-library/jest-dom';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();
const lib = require('../../utils/fetchPrivateGroup');

describe('fetchPrivateGroup', () => {
  test('createPrivateGroup', async () => {
    const data = await lib.createPrivateGroup('group', 'wrf', 'sport');
    expect(data).toBe(200);
  });

  test('fetchAllPrivateGroups', async () => {
    fetch.mockResponse(JSON.stringify(
      [{ id: 'group' }],
    ));
    const data = await lib.fetchAllPrivateGroups();
    expect(data[0].id).toBe('group');
  });

  test('fetchGroup', async () => {
    fetch.mockResponse(JSON.stringify(
      { id: 'group', creator: 'wrf' },
    ));
    const data = await lib.fetchGroup('group');
    expect(data.creator).toBe('wrf');
  });

  test('fetchSuggestedGroup', async () => {
    fetch.mockResponse(JSON.stringify(
      [{ id: 'group', creator: 'wrf' }],
    ));
    const data = await lib.fetchSuggestedGroup('wrf');
    expect(data[0].creator).toBe('wrf');
  });

  test('requestJoin', async () => {
    const data = await lib.requestJoin('group', 'wrf');
    expect(data).toBe(200);
  });

  test('removeRequestJoin', async () => {
    const data = await lib.removeRequestJoin('group', 'wrf');
    expect(data).toBe(200);
  });

  test('removeRequestJoin', async () => {
    const data = await lib.removeRequestJoin('group', 'wrf');
    expect(data).toBe(200);
  });

  test('approveRequestJoin', async () => {
    const data = await lib.approveRequestJoin('group', 'wrf');
    expect(data).toBe(200);
  });

  test('flagForDeletion', async () => {
    const data = await lib.flagForDeletion('group', 'wrf', '01');
    expect(data).toBe(200);
  });

  test('flagForDeletion', async () => {
    const data = await lib.flagForDeletion('group', 'wrf', '01');
    expect(data).toBe(200);
  });

  test('unflagForDeletion', async () => {
    const data = await lib.unflagForDeletion('group', 'wrf', '01');
    expect(data).toBe(200);
  });

  test('fetchGroupPost', async () => {
    fetch.mockResponse(JSON.stringify(
      [{ id: '001', author: 'wrf' }],
    ));
    const data = await lib.fetchGroupPost('group', 'wrf');
    expect(data[0].id).toBe('001');
  });

  test('exitGroup', async () => {
    const data = await lib.exitGroup('group', 'wrf');
    expect(data).toBe(200);
  });

  test('promoteAdmin', async () => {
    const data = await lib.promoteAdmin('group', 'wrf');
    expect(data).toBe(200);
  });

  test('revokeAdmin', async () => {
    const data = await lib.revokeAdmin('group', 'wrf');
    expect(data).toBe(200);
  });

  test('deletePost', async () => {
    const data = await lib.deletePost('post', 'group');
    expect(data).toBe(200);
  });
});
