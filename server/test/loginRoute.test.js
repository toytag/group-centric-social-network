/* eslint-disable */
const request = require('supertest');
const mongoose = require('mongoose');
const webapp = require('../server');
const User = require('../models/User');

let db;

const clearDatabase = async () => {
  try {
    const result = await User.deleteOne({ id: 'testuser' });
    const { deletedCount } = result;
    if (deletedCount === 1) {
      console.log('info', 'Successfully deleted player');
    } else {
      console.log('warning', 'player was not deleted');
    }
  } catch (err) {
    console.log('error', err.message);
  }
};

beforeAll(async () => {
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

describe('user login', () => {
  test('Test status code of Login', async () => {
		const data = {id:'testuser', password:'Test_user123', attempts:0};
    const newUser = new User(data);
    await newUser.save();
		// Success
    const res = await request(webapp).post('/api/login/').send({id:'testuser', password:'Test_user123'});
		expect(res.status).toBe(200);
    expect(JSON.parse(res.text).msg).toBe('Success.');

    // Wrong password.
    const res_2 = await request(webapp).post('/api/login/').send({id:'testuser', password:'Test_user'});
		expect(res_2.status).toBe(400);
    expect(JSON.parse(res_2.text).msg).toBe('Wrong password.');
	});

  test('Test status code of Login', async () => {
		const data = {id:'testuser', password:'Test_user123', attempts:3, last_attempt: Date.now()};
    const newUser = new User(data);
    await newUser.save();
    // Wrong password.
    const res_2 = await request(webapp).post('/api/login/').send({id:'testuser', password:'Test_user'});
		expect(res_2.status).toBe(401);
    expect(JSON.parse(res_2.text).msg).toBe('Too many unsuccessful attempts. The acount is locked.');
	});
});