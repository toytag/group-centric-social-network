/* eslint-disable */
const { Buffer } = require('buffer');
const mongoose = require('mongoose');
const FileSystem = require('../models/FileSystem');
require('dotenv').config();

beforeAll(async () => {
  // connect to test database
  await mongoose.connect(
    process.env.MONGODB_TEST_URI, 
    { useNewUrlParser: true, useUnifiedTopology: true },
  );
  // clear test database
  FileSystem.clear();
});

afterAll(async () => {
  // clear test database
  FileSystem.clear();
});

describe('FileSystem Test', () => {
  const testFile = {
    originalname: 'test.txt',
    mimetype: 'text/plain',
    buffer: Buffer.from('hello world'),
  };

  test('uploadFile', async () => {
    const file = await FileSystem.uploadFile(
      testFile.originalname, testFile.mimetype, testFile.buffer,
    );
    expect(file).toBeDefined();
  });

  test('getFileById', async () => {
    const file = await FileSystem.uploadFile(
      testFile.originalname, testFile.mimetype, testFile.buffer,
    );
    const gettedFile = await FileSystem.getFileById(file._id);
    expect(file).toStrictEqual(gettedFile);
  });

  test('downloadFileById', async () => {
    const file = await FileSystem.uploadFile(
      testFile.originalname, testFile.mimetype, testFile.buffer,
    );
    const downloadStream = await FileSystem.downloadFileById(file._id);
    expect(downloadStream).toBeDefined();
  });

  test('updateFileById', async () => {
    const file = await FileSystem.uploadFile(
      testFile.originalname, testFile.mimetype, testFile.buffer,
    );
    const newFile = await FileSystem.updateFileById(
      file._id, 'new.txt', testFile.mimetype, testFile.buffer,
    );
    expect(newFile).toBeDefined();
  });

  test('deleteFileById', async () => {
    const file = await FileSystem.uploadFile(
      testFile.originalname, testFile.mimetype, testFile.buffer,
    );
    await FileSystem.deleteFileById(file._id);
    const gettedFile = await FileSystem.getFileById(file._id);
    expect(gettedFile).toBeNull();
  });
});
