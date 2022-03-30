/* eslint-disable */
const request = require('supertest');
const mongoose = require('mongoose');
const webapp = require('../server');
const Group = require('../models/PublicGroup');
const User = require('../models/User');

let db;

const clearDatabase = async () => {
  try {
    const result = await User.deleteOne({ id: 'testuser' });
    const result_2 = await Group.findOne({ id: 'testgroup' });
    if (result_2 != null) {
      await Group.deleteOne({ id: 'testgroup' });
      console.log('info', 'Successfully deleted group');
    }
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

describe('get Suggested Group', () => {
  test('get Suggested Group', async () => {
    const group_data = {id:'testgroup', tag:'test', members:['testuser']};
    const newGroup = new Group(group_data);
    await newGroup.save();

    const user_data = {id:'testuser', password:'Test_user123'};
    const newUser = new User(user_data);
    await newUser.save();

    const res = await request(webapp).get('/api/suggestedgroup/testuser');
		expect(res.status).toBe(200);
  });
});