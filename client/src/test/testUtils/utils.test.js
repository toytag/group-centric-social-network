import '@testing-library/jest-dom';

const lib = require('../../utils/utils');

describe('utils', () => {
  test('checkString', async () => {
    let input = 'teststring';
    let flag = lib.checkString(input);
    expect(flag).toBe(true);
    input = '';
    flag = lib.checkString(input);
    expect(flag).toBe(false);
  });

  test('checkUsername', async () => {
    const input = 'teststring';
    const result = lib.checkUsername(input);
    expect(result).toBe(true);
  });

  test('checkPassword', async () => {
    const input = 'teststring';
    const result = lib.checkPassword(input);
    expect(result).toBe(false);
  });

  test('checkFile', async () => {
    const input = null;
    let result = lib.checkFile(input);
    expect(result).toBe(true);

    let file = { size: 1024, type: null };
    result = lib.checkFile(file);
    expect(result).toBe(false);

    file = { size: 16 * 1024 * 1024, type: 'image/jpeg' };
    result = lib.checkFile(file);
    expect(result).toBe(false);
  });

  test('checkImage', async () => {
    const input = null;
    let result = lib.checkImage(input);
    expect(result).toBe(false);

    let file = { size: 1024, type: null };
    result = lib.checkImage(file);
    expect(result).toBe(false);

    file = { size: 16 * 1024 * 1024, type: 'image/jpeg' };
    result = lib.checkImage(file);
    expect(result).toBe(false);
  });

  test('checkAudio', async () => {
    const input = null;
    let result = lib.checkAudio(input);
    expect(result).toBe(false);

    let file = { size: 1024, type: null };
    result = lib.checkAudio(file);
    expect(result).toBe(false);

    file = { size: 16 * 1024 * 1024, type: 'audio/mpeg' };
    result = lib.checkAudio(file);
    expect(result).toBe(false);
  });

  test('checkVideo', async () => {
    const input = null;
    let result = lib.checkVideo(input);
    expect(result).toBe(false);

    let file = { size: 1024, type: null };
    result = lib.checkVideo(file);
    expect(result).toBe(false);

    file = { size: 16 * 1024 * 1024, type: 'video/mp4' };
    result = lib.checkVideo(file);
    expect(result).toBe(false);
  });

  test('convertTime', async () => {
    const input = '1';
    const result = lib.convertTime(input);
    expect(result).toBe('Jan 1 2001 ');
  });

  test('messageTime', async () => {
    const input = '1';
    const result = lib.messageTime(input);
    const time = new Date(input);
    expect(result).toBe(`${time.toLocaleDateString()} ${time.toLocaleTimeString()}`);
  });

  test('parseFileType', async () => {
    let input = 'image/';
    let result = lib.parseFileType(input);
    expect(result).toBe('img');

    input = 'audio/';
    result = lib.parseFileType(input);
    expect(result).toBe('audio');

    input = 'video/';
    result = lib.parseFileType(input);
    expect(result).toBe('video');

    input = './';
    result = lib.parseFileType(input);
    expect(result).toBe('img');
  });

  test('checkUserInPublicGroup', async () => {
    let userInfo = { publicgroups: ['group'] };
    let result = lib.checkUserInPublicGroup(userInfo, 'group');
    expect(result).toBe(true);

    userInfo = { publicgroups: ['group_'] };
    result = lib.checkUserInPublicGroup(userInfo, 'group');
    expect(result).toBe(false);

    userInfo = null;
    result = lib.checkUserInPublicGroup(userInfo, 'group');
    expect(result).toBe(false);
  });

  test('checkUserInPrivateGroup', async () => {
    let userInfo = { privategroups: ['group'] };
    let result = lib.checkUserInPrivateGroup(userInfo, 'group');
    expect(result).toBe(true);

    userInfo = { privategroups: ['group_'] };
    result = lib.checkUserInPrivateGroup(userInfo, 'group');
    expect(result).toBe(false);

    userInfo = null;
    result = lib.checkUserInPrivateGroup(userInfo, 'group');
    expect(result).toBe(false);
  });

  test('checkUserRequested', async () => {
    let group = { joinRequest: ['wrf'] };
    let result = lib.checkUserRequested('wrf', group);
    expect(result).toBe(true);

    group = { joinRequest: ['wrf_'] };
    result = lib.checkUserRequested('wrf', group);
    expect(result).toBe(false);
  });
});
