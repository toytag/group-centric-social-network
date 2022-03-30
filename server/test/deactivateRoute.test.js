/* eslint-disable */
const request = require('supertest');
const mongoose = require('mongoose');
const webapp = require('../server');
const User = require('../models/User');
const PublicGroup = require('../models/PublicGroup');
const PublicPost = require('../models/PublicPost');
const PrivateGroup = require('../models/PrivateGroup');
const PrivatePost = require('../models/PrivatePost');
const FileSystem = require('../models/FileSystem');
const Message = require('../models/Message');
const ChatThread = require('../models/ChatThread');

let db;

let lib = require('../routes/deactivateRoute')

const clearDatabase = async () => {
  try {
    let result = await User.deleteOne({ id: 'testuser' });

    result = await PrivatePost.findOne({group:'testgroup', author:'testuser'});
    if (result != null) {
      await PrivatePost.deleteOne({group:'testgroup', author:'testuser'});
    }
    result = await PublicPost.findOne({group:'testgroup', author:'testuser'});
    if (result != null) {
      await PublicPost.deleteOne({group:'testgroup', author:'testuser'});
    }

    result = await PublicGroup.findOne({id: 'testgroup'});
    if (result != null) {
      await PublicGroup.deleteOne({ id: 'testgroup' });
    }
    result = await PrivateGroup.findOne({id: 'testgroup'});
    if (result != null) {
      await PrivateGroup.deleteOne({ id: 'testgroup' });
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

describe('user deactivate', () => {
  test('Test status code of Deactivate', async () => {
		const data = {id:'testuser', password:'Test_user123', attempts:0};
    const newUser = new User(data);
    await newUser.save();
		// Success
    const res = await request(webapp).post('/api/deactivate/').send({id:'testuser', password:'Test_user123'});
		expect(res.status).toBe(200);
    expect(JSON.parse(res.text).msg).toBe('Success.');
    const result = await User.findOne({id:'testuser'});
    expect(result).toBe(null);
	});

  test('Test status code of Deactivate', async () => {
		const data = {id:'testuser', password:'Test_user123', attempts:0};
    const newUser = new User(data);
    await newUser.save();
		// Wrong password.
    const res = await request(webapp).post('/api/deactivate/').send({id:'testuser', password:'Test_user124'});
		expect(res.status).toBe(400);
    expect(JSON.parse(res.text).msg).toBe('Wrong Password');
	});
});

// describe('notify', () => {
//   test('Test notify', async () => {
// 		const user_data = {id:'testuser', password:'Test_user123', publicgroups:['testgroup']};
//     const newUser = new User(user_data);
//     await newUser.save();

//     const group_data = {id:'testgroup', tag:'test', members:['testuser']};
//     const newGroup = new PublicGroup(group_data);
//     await newGroup.save();
// 		// Success
//     const res = await lib.notify('testgroup', 'testuser', 'public');
// 	});
// });