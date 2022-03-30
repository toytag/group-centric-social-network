/* eslint-disable */
const request = require('supertest');
const mongoose = require('mongoose');
const webapp = require('../server');
const Post = require('../models/PublicPost');

let db;

const clearDatabase = async () => {
  try {
    const result = await Post.deleteOne({ id: 'testpost' });
  } catch (err) {
    console.log('error', err.message);
  }
};

beforeAll(async () =>{
  db = await mongoose.connect(
    process.env.MONGODB_TEST_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
  );
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await db.disconnect();
});

describe('get Popular Post', () => {
  test('get Popular Post', async () => {
    const data = {group:'testgroup', author:'testuser', attachment: {fileID: null}, date:20211213};
    const newPost = new Post(data);
    await newPost.save();

    const res = await request(webapp).get('/api/popularpost');
		expect(res.status).toBe(200);
  });
});