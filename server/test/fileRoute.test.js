/* eslint-disable */
const request = require('supertest');
const webapp = require('express')();
const path = require('path');
const fs = require('fs');

const FileSystem = require('../models/FileSystem');
jest.mock('../models/FileSystem');

beforeAll(() => {
  webapp.use('/', require('../routes/fileRoute'));
})

describe('fileRoute Test', () => {
  test('post / status 201', async () => {
    FileSystem.uploadFile.mockResolvedValue({
      _id: 'test_id',
      name: 'fileRoute.test.js',
      contentType: 'application/javascript',
      length: 123,
    });
    const res = await request(webapp).post('/').attach('file', path.join(__dirname, './fileRoute.test.js'));
    expect(FileSystem.uploadFile).toHaveBeenCalled();
    expect(res.statusCode).toBe(201);
    expect(res.body).toBe('test_id');
  });

  test('post / status 500', async () => {
    FileSystem.uploadFile.mockRejectedValue('Internal server error');
    const res = await request(webapp).post('/').attach('file', path.join(__dirname, './fileRoute.test.js'));
    expect(FileSystem.uploadFile).toHaveBeenCalled();
    expect(res.statusCode).toBe(500);
    expect(res.body).toBe('Internal server error');
  });

  test('get /delete status 200', async () => {
    FileSystem.clear.mockResolvedValue();
    const res = await request(webapp).get('/delete');
    expect(FileSystem.clear).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('All files are deleted');
  });

  test('get /:id status 200', async () => {
    FileSystem.getFileById.mockResolvedValue({
      _id: 'test_id',
      name: 'fileRoute.test.js',
      contentType: 'application/javascript',
      length: 123,
    });
    FileSystem.downloadFileById.mockResolvedValue(
      fs.createReadStream(path.join(__dirname, './fileRoute.test.js')),
    );
    const res = await request(webapp).get('/test_id');
    expect(FileSystem.getFileById).toHaveBeenCalled();
    expect(FileSystem.downloadFileById).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.header).toMatchObject({
      'content-type': 'application/javascript',
      'content-length': '123',
    });
  });

  test('get /:id status 404', async () => {
    FileSystem.getFileById.mockRejectedValue('File not found');
    const res = await request(webapp).get('/test_id');
    expect(FileSystem.getFileById).toHaveBeenCalled();
    expect(res.statusCode).toBe(404);
    expect(res.body).toBe('File not found');
  });

  test('put /:id status 201', async () => {
    FileSystem.updateFileById.mockResolvedValue({
      _id: 'test_id',
      name: 'fileRoute.test.js',
      contentType: 'application/javascript',
      length: 123,
    });
    const res = await request(webapp).put('/test_id').attach('file', path.join(__dirname, './fileRoute.test.js'));
    expect(FileSystem.updateFileById).toHaveBeenCalled();
    expect(res.statusCode).toBe(201);
    expect(res.body).toBe('test_id');
  });

  test('put /:id status 500', async () => {
    FileSystem.updateFileById.mockRejectedValue('Internal server error');
    const res = await request(webapp).put('/test_id').attach('file', path.join(__dirname, './fileRoute.test.js'));
    expect(FileSystem.updateFileById).toHaveBeenCalled();
    expect(res.statusCode).toBe(500);
    expect(res.body).toBe('Internal server error');
  });

  test('delete /:id status 200', async () => {
    FileSystem.deleteFileById.mockResolvedValue();
    const res = await request(webapp).delete('/test_id');
    expect(FileSystem.deleteFileById).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('File with id <test_id> delete success');
  });

  test('delete /:id status 404', async () => {
    FileSystem.deleteFileById.mockRejectedValue('File not found');
    const res = await request(webapp).delete('/test_id');
    expect(FileSystem.deleteFileById).toHaveBeenCalled();
    expect(res.statusCode).toBe(404);
    expect(res.body).toBe('File not found');
  });
});
