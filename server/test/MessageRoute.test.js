/* eslint-disable */
const request = require('supertest');
const mongoose = require('mongoose');
const webapp = require('../server');
const User = require('../models/User');
const Message = require('../models/Message');

let db;

const clearDatabase = async () => {
  try {
    const result = await User.deleteOne({ id: 'testuser' });
    const result_2 = await Message.deleteOne({ chatID: 'testchat' });
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

describe('Post a message', () => {
  test('Post a message', async () => {
    const user_data = {id:'testuser', password:'Test_user123'};
    const newUser = new User(user_data);
    await newUser.save();

    const data = {chatID:'testchat', from:'testuser', to:'testuser', content:'test', type:'text' };
    const res = await request(webapp).post('/api/message').send(data);
		expect(res.status).toBe(201);
    const result = await Message.findOne({ chatID: 'testchat' });
    expect(result.to).toBe('testuser');
  });
});

describe('get Message', () => {
  test('get Message', async () => {
    const user_data = {id:'testuser', password:'Test_user123'};
    const newUser = new User(user_data);
    await newUser.save();

    const data = {chatID:'testchat', from:'testuser', to:'testuser', content:'test', type:'text' };
    const newMessage = new Message(data);
    await newMessage.save();
    const result = await Message.findOne({chatID:'testchat'});
    const message_id = result._id;

    const res = await request(webapp).get(`/api/message/${message_id}`);
		expect(res.status).toBe(200);
  });
});

