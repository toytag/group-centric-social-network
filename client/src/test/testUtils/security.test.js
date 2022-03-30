import '@testing-library/jest-dom';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();
const lib = require('../../utils/security');

describe('security', () => {
  test('login', async () => {
    const data = await lib.login('wrf', '123');
    expect(data).toBe(200);
  });

  test('changepassword', async () => {
    const data = await lib.changepassword('wrf', '123', '234');
    expect(data).toBe(200);
  });

  test('deactivate', async () => {
    const data = await lib.deactivate('wrf', '123');
    expect(data).toBe(200);
  });
});
