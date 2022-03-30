import '@testing-library/jest-dom';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();
const lib = require('../../utils/fetchMessage');

describe('fetchMessage', () => {
  test('sendMessage', async () => {
    fetch.mockResponse(JSON.stringify(
      '001',
    ));
    const data = await lib.sendMessage('from', 'to', 'text', null, 'type', 'chatID');
    expect(data).toBe('001');
  });

  test('sendMessage', async () => {
    fetch.mockResponse(JSON.stringify(
      '001',
    ));
    const file = new Blob([JSON.stringify({ name: 'file.jpg' }, null, 2)], { type: 'application/json' });
    const data = await lib.sendMessage('from', 'to', null, file, 'type', 'chatID');
    expect(data).toBe('001');
  });

  test('fetchChat', async () => {
    fetch.mockResponse(JSON.stringify(
      [{ from: 'from', to: 'to' }],
    ));
    const data = await lib.fetchChat('chatID');
    expect(data[0].from).toBe('from');
  });

  test('fetchMessage', async () => {
    fetch.mockResponse(JSON.stringify(
      { id: 'ID', from: 'from', to: 'to' },
    ));
    const data = await lib.fetchMessage('ID');
    expect(data.from).toBe('from');
  });

  test('createChatThread', async () => {
    const data = await lib.createChatThread('initiator', 'recipient');
    expect(data).toBe(200);
  });

  test('check', async () => {
    const data = await lib.check('initiator', 'recipient');
    expect(data).toBe(200);
  });

  test('deleteChat', async () => {
    const data = await lib.deleteChat('wrf', '001');
    expect(data).toBe(200);
  });
});
