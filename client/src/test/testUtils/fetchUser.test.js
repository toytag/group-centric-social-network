import '@testing-library/jest-dom';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();
const lib = require('../../utils/fetchUser');

describe('Fetch-mock: fetchUser', () => {
  test('fetchUser', async () => {
    fetch.mockResponse(JSON.stringify(
      { id: 'wrf', password: '123' },
    ));
    const data = await lib.fetchUser('wrf');
    expect(data.password).toBe('123');
  });

  test('register', async () => {
    fetch.mockResponse(JSON.stringify(
      { id: 'wrf', password: '123' },
    ));
    const data = await lib.register('wrf', '123');
    expect(data).toBe(200);
  });

  test('hidePost', async () => {
    const data = await lib.hidePost('wrf', '01', 'group', 'public');
    expect(data).toBe(200);
  });

  test('invite', async () => {
    const data = await lib.invite('wrf', 'xjq', 'group', 'public');
    expect(data).toBe(200);
  });

  test('fetchUserPost', async () => {
    fetch.mockResponse(JSON.stringify([
      { title: 'testpost' },
    ]));
    const data = await lib.fetchUserPost('wrf');
    expect(data[0].title).toBe('testpost');
  });

  test('fetchUserNotificationNumber', async () => {
    fetch.mockResponse(JSON.stringify(5));
    const data = await lib.fetchUserNotificationNumber('wrf');
    expect(data).toBe(5);
  });

  test('deleteNotification', async () => {
    const data = await lib.deleteNotification('wrf', '01');
    expect(data).toBe(200);
  });

  test('deletePost', async () => {
    const data = await lib.deletePost('01', 'public');
    expect(data).toBe(200);
  });

  test('rejectInvitation', async () => {
    const data = await lib.rejectInvitation('wrf', 'xjq', 'group');
    expect(data).toBe(200);
  });

  test('acceptInvitation', async () => {
    const data = await lib.acceptInvitation('wrf', 'xjq', 'group');
    expect(data).toBe(200);
  });

  test('fetchChat', async () => {
    fetch.mockResponse(JSON.stringify([
      { content: 'hahaha' },
    ]));
    const data = await lib.fetchChat('wrf');
    expect(data[0].content).toBe('hahaha');
  });
});
