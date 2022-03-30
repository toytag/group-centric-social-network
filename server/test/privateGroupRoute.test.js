/* eslint-disable */
const request = require('supertest');
const mongoose = require('mongoose');
const webapp = require('../server');
const PrivateGroup = require('../models/PrivateGroup');
const User = require('../models/User');

let db;
const clearDatabase = async () => {
  try {
    const result = await PrivateGroup.deleteOne({ id: 'testgroup' });
    const result_2 = await User.findOne({ id: 'testuser' });
    if (result_2 != null) {
      await User.deleteOne({ id: 'testuser' });
      console.log('info', 'Successfully deleted user');
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

describe('get All Private Groups information', () => {
  test('get All Private Groups', async () => {
    const data = {id:'testgroup', tag:'test'};
    const newGroup = new PrivateGroup(data);
    await newGroup.save();
		// Success
    const res = await request(webapp).get('/api/privategroup/');
		expect(res.status).toBe(200);
  });
});

describe('create Private Group', () => {
  test('create Private Group', async () => {
    const res = await request(webapp).post('/api/privategroup/').send({id:'testgroup', tag:'test'});
		expect(res.status).toBe(201);
  });

  test('create Private Group fail', async () => {
    await request(webapp).post('/api/privategroup/').send({id:'testgroup', tag:'test'});
    const res = await request(webapp).post('/api/privategroup/').send({id:'testgroup', tag:'test'});
    expect(res.status).toBe(409);
    expect(JSON.parse(res.text).msg).toBe('Groupname existed.');
  });
});

describe('Gets a Private Group information', () => {
  test('get PrivateGroup', async () => {
		const data = {id:'testgroup', tag:'test'};
    const newGroup = new PrivateGroup(data);
    await newGroup.save();
		// Success
    const res = await request(webapp).get('/api/privategroup/testgroup');
		expect(res.status).toBe(200);
    expect(JSON.parse(res.text).id).toBe('testgroup');
  });

  test('get PrivateGroup failed', async () => {
		// fail
    const res = await request(webapp).get('/api/privategroup/testgroup');
		expect(res.status).toBe(404);
    expect(JSON.parse(res.text).msg).toBe('Group not found.');
  });
});

describe('Add Member to PrivateGroup', () => {
  test('Add Member to PrivateGroup', async () => {
    const data = {id:'testgroup', tag:'test'};
    const newGroup = new PrivateGroup(data);
    await newGroup.save();

    const user_data = {id:'testuser', password:'Test_user123', attempts:0};
    const newUser = new User(user_data);
    await newUser.save();
		// Success
    const res = await request(webapp).post('/api/privategroup/testgroup/member').send({userID:'testuser'});
		expect(res.status).toBe(200);
    const result = await PrivateGroup.findOne({ id: 'testgroup' });
    expect(result.members.length).toBe(1);
  });
});

describe('delete Member from PrivateGroup', () => {
  test('delete Member from PrivateGroup', async () => {
    const data = {id:'testgroup', tag:'test', members:['testuser',]};
    const newGroup = new PrivateGroup(data);
    await newGroup.save();

    const user_data = {id:'testuser', password:'Test_user123'};
    const newUser = new User(user_data);
    await newUser.save();
		// Success
    const res = await request(webapp).delete('/api/privategroup/testgroup/member').send({userID:'testuser'});
		expect(res.status).toBe(200);
    const result = await PrivateGroup.findOne({ id: 'testgroup' });
    expect(result.members.length).toBe(0);
  });
});

describe('Add Post to PrivateGroup', () => {
  test('Add Post to PrivateGroup', async () => {
    const data = {id:'testgroup', tag:'test'};
    const newGroup = new PrivateGroup(data);
    await newGroup.save();
		// Success
    const res = await request(webapp).post('/api/privategroup/testgroup/post').send({postID:'testpost'});
		expect(res.status).toBe(200);
    const result = await PrivateGroup.findOne({ id: 'testgroup' });
    expect(result.posts.length).toBe(1);
  });
});

describe('Add joinRequest to PrivateGroup', () => {
  test('Add joinRequest to PrivateGroup', async () => {
    const data = {id:'testgroup', tag:'test'};
    const newGroup = new PrivateGroup(data);
    await newGroup.save();
		// Success
    const res = await request(webapp).post('/api/privategroup/testgroup/request').send({userID:'testuser'});
		expect(res.status).toBe(200);
    const result = await PrivateGroup.findOne({ id: 'testgroup' });
    expect(result.joinRequest.length).toBe(1);
  });
});

describe('Delete joinRequest of PrivateGroup', () => {
  test('Delete joinRequest of PrivateGroup', async () => {
    const data = {id:'testgroup', tag:'test', joinRequest: ['testuser']};
    const newGroup = new PrivateGroup(data);
    await newGroup.save();
		// Success
    const res = await request(webapp).delete('/api/privategroup/testgroup/request').send({userID:'testuser'});
		expect(res.status).toBe(200);
    const result = await PrivateGroup.findOne({ id: 'testgroup' });
    expect(result.joinRequest.length).toBe(0);
  });
});

describe('Delete joinRequest of PrivateGroup', () => {
  test('Delete joinRequest of PrivateGroup', async () => {
    const data = {id:'testgroup', tag:'test', joinRequest: ['testuser']};
    const newGroup = new PrivateGroup(data);
    await newGroup.save();
		// Success
    const res = await request(webapp).delete('/api/privategroup/testgroup/request').send({userID:'testuser'});
		expect(res.status).toBe(200);
    const result = await PrivateGroup.findOne({ id: 'testgroup' });
    expect(result.joinRequest.length).toBe(0);
  });
});

describe('Add Deletion Request to PrivateGroup', () => {
  test('Add Deletion Request to PrivateGroup', async () => {
    const data = {id:'testgroup', tag:'test'};
    const newGroup = new PrivateGroup(data);
    await newGroup.save();
		// Success
    const res = await request(webapp).post('/api/privategroup/testgroup/deletion').send({userID:'testuser', postID:'testpost'});
		expect(res.status).toBe(200);
    const result = await PrivateGroup.findOne({ id: 'testgroup' });
    expect(result.deletionRequest.length).toBe(1);
  });
});

describe('Delete Deletion Request of PrivateGroup', () => {
  test('Delete Deletion Request of PrivateGroup', async () => {
    const data = {id:'testgroup', tag:'test', deletionRequest: [{from:'testuser', postID:'testpost'}]};
    const newGroup = new PrivateGroup(data);
    await newGroup.save();
		// Success
    const res = await request(webapp).delete('/api/privategroup/testgroup/deletion').send({userID:'testuser', postID:'testpost'});
		expect(res.status).toBe(200);
    const result = await PrivateGroup.findOne({ id: 'testgroup' });
    expect(result.deletionRequest.length).toBe(0);
  });
});

describe('get User Post in PrivateGroup', () => {
  test('get User Post in PrivateGroup', async () => {
    const data = {id:'testgroup', tag:'test'};
    const newGroup = new PrivateGroup(data);
    await newGroup.save();

    const user_data = {id:'testuser', password:'Test_user123'};
    const newUser = new User(user_data);
    await newUser.save();
		// Success
    const res = await request(webapp).get('/api/privategroup/testgroup/post/testuser');
		expect(res.status).toBe(200);
  });
});

describe('Add Admin to PrivateGroup', () => {
  test('Add Admin to PrivateGroup', async () => {
    const data = {id:'testgroup', tag:'test'};
    const newGroup = new PrivateGroup(data);
    await newGroup.save();

    const user_data = {id:'testuser', password:'Test_user123'};
    const newUser = new User(user_data);
    await newUser.save();
		// Success
    const res = await request(webapp).post('/api/privategroup/testgroup/admin').send({userID:'testuser'});
		expect(res.status).toBe(200);
    const result = await PrivateGroup.findOne({ id: 'testgroup' });
    expect(result.admins.length).toBe(1);
  });
});

describe('Delete Deletion Request of PrivateGroup', () => {
  test('Delete Deletion Request of PrivateGroup', async () => {
    const data = {id:'testgroup', tag:'test', admins: ['testuser']};
    const newGroup = new PrivateGroup(data);
    await newGroup.save();
		// Success
    const res = await request(webapp).delete('/api/privategroup/testgroup/admin').send({userID:'testuser'});
		expect(res.status).toBe(200);
    const result = await PrivateGroup.findOne({ id: 'testgroup' });
    expect(result.deletionRequest.length).toBe(0);
  });
});