/* eslint-disable */
const request = require('supertest');
const mongoose = require('mongoose');
const webapp = require('../server');
const PublicGroup = require('../models/PublicGroup');
const User = require('../models/User');

let db;
const clearDatabase = async () => {
  try {
    const result = await PublicGroup.deleteOne({ id: 'testgroup' });
    const result_2 = await User.findOne({ id: 'testuser' });
    if (result_2 != null) {
      await User.deleteOne({ id: 'testuser' });
      console.log('info', 'Successfully deleted user');
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

describe('get All Public Groups information', () => {
  test('get All Public Groups', async () => {
    const data = {id:'testgroup', tag:'test'};
    const newGroup = new PublicGroup(data);
    await newGroup.save();
		// Success
    const res = await request(webapp).get('/api/publicgroup/');
		expect(res.status).toBe(200);
  });
});

describe('create Public Group', () => {
  test('create Public Group', async () => {
    const res = await request(webapp).post('/api/publicgroup/').send({id:'testgroup', tag:'test'});
		expect(res.status).toBe(201);
  });

  test('create Public Group fail', async () => {
    await request(webapp).post('/api/publicgroup/').send({id:'testgroup', tag:'test'});
    const res = await request(webapp).post('/api/publicgroup/').send({id:'testgroup', tag:'test'});
    expect(res.status).toBe(409);
    expect(JSON.parse(res.text).msg).toBe('Groupname existed.');
  });
});

describe('Gets a Public Group information', () => {
  test('get PublicGroup', async () => {
		const data = {id:'testgroup', tag:'test'};
    const newGroup = new PublicGroup(data);
    await newGroup.save();
		// Success
    const res = await request(webapp).get('/api/publicgroup/testgroup');
		expect(res.status).toBe(200);
    expect(JSON.parse(res.text).id).toBe('testgroup');
  });

  test('get PublicGroup failed', async () => {
		// fail
    const res = await request(webapp).get('/api/publicgroup/testgroup');
		expect(res.status).toBe(404);
    expect(JSON.parse(res.text).msg).toBe('Group not found.');
  });
});

describe('Add Member to PublicGroup', () => {
  test('Add Member to PublicGroup', async () => {
    const data = {id:'testgroup', tag:'test'};
    const newGroup = new PublicGroup(data);
    await newGroup.save();

    const user_data = {id:'testuser', password:'Test_user123', attempts:0};
    const newUser = new User(user_data);
    await newUser.save();
		// Success
    const res = await request(webapp).post('/api/publicgroup/testgroup/member').send({userID:'testuser'});
		expect(res.status).toBe(200);
    const result = await PublicGroup.findOne({ id: 'testgroup' });
    expect(result.members.length).toBe(1);
  });
});

describe('delete Member from PublicGroup', () => {
  test('delete Member from PublicGroup', async () => {
    const data = {id:'testgroup', tag:'test', members:['testuser',]};
    const newGroup = new PublicGroup(data);
    await newGroup.save();

    const user_data = {id:'testuser', password:'Test_user123'};
    const newUser = new User(user_data);
    await newUser.save();
		// Success
    const res = await request(webapp).delete('/api/publicgroup/testgroup/member').send({userID:'testuser'});
		expect(res.status).toBe(200);
    const result = await PublicGroup.findOne({ id: 'testgroup' });
    expect(result.members.length).toBe(0);
  });
});

describe('Add Post to PublicGroup', () => {
  test('Add Post to PublicGroup', async () => {
    const data = {id:'testgroup', tag:'test'};
    const newGroup = new PublicGroup(data);
    await newGroup.save();
		// Success
    const res = await request(webapp).post('/api/publicgroup/testgroup/post').send({postID:'testpost'});
		expect(res.status).toBe(200);
    const result = await PublicGroup.findOne({ id: 'testgroup' });
    expect(result.posts.length).toBe(1);
  });
});

describe('Add joinRequest to PublicGroup', () => {
  test('Add joinRequest to PublicGroup', async () => {
    const data = {id:'testgroup', tag:'test'};
    const newGroup = new PublicGroup(data);
    await newGroup.save();
		// Success
    const res = await request(webapp).post('/api/publicgroup/testgroup/request').send({userID:'testuser'});
		expect(res.status).toBe(200);
    const result = await PublicGroup.findOne({ id: 'testgroup' });
    expect(result.joinRequest.length).toBe(1);
  });
});

describe('Delete joinRequest of PublicGroup', () => {
  test('Delete joinRequest of PublicGroup', async () => {
    const data = {id:'testgroup', tag:'test', joinRequest: ['testuser']};
    const newGroup = new PublicGroup(data);
    await newGroup.save();
		// Success
    const res = await request(webapp).delete('/api/publicgroup/testgroup/request').send({userID:'testuser'});
		expect(res.status).toBe(200);
    const result = await PublicGroup.findOne({ id: 'testgroup' });
    expect(result.joinRequest.length).toBe(0);
  });
});

describe('Delete joinRequest of PublicGroup', () => {
  test('Delete joinRequest of PublicGroup', async () => {
    const data = {id:'testgroup', tag:'test', joinRequest: ['testuser']};
    const newGroup = new PublicGroup(data);
    await newGroup.save();
		// Success
    const res = await request(webapp).delete('/api/publicgroup/testgroup/request').send({userID:'testuser'});
		expect(res.status).toBe(200);
    const result = await PublicGroup.findOne({ id: 'testgroup' });
    expect(result.joinRequest.length).toBe(0);
  });
});

describe('Add Deletion Request to PublicGroup', () => {
  test('Add Deletion Request to PublicGroup', async () => {
    const data = {id:'testgroup', tag:'test'};
    const newGroup = new PublicGroup(data);
    await newGroup.save();
		// Success
    const res = await request(webapp).post('/api/publicgroup/testgroup/deletion').send({userID:'testuser', postID:'testpost'});
		expect(res.status).toBe(200);
    const result = await PublicGroup.findOne({ id: 'testgroup' });
    expect(result.deletionRequest.length).toBe(1);
  });
});

describe('Delete Deletion Request of PublicGroup', () => {
  test('Delete Deletion Request of PublicGroup', async () => {
    const data = {id:'testgroup', tag:'test', deletionRequest: [{from:'testuser', postID:'testpost'}]};
    const newGroup = new PublicGroup(data);
    await newGroup.save();
		// Success
    const res = await request(webapp).delete('/api/publicgroup/testgroup/deletion').send({userID:'testuser', postID:'testpost'});
		expect(res.status).toBe(200);
    const result = await PublicGroup.findOne({ id: 'testgroup' });
    expect(result.deletionRequest.length).toBe(0);
  });
});

describe('get User Post in PublicGroup', () => {
  test('get User Post in PublicGroup', async () => {
    const data = {id:'testgroup', tag:'test'};
    const newGroup = new PublicGroup(data);
    await newGroup.save();

    const user_data = {id:'testuser', password:'Test_user123'};
    const newUser = new User(user_data);
    await newUser.save();
		// Success
    const res = await request(webapp).get('/api/publicgroup/testgroup/post/testuser');
		expect(res.status).toBe(200);
  });
});

describe('Add Admin to PublicGroup', () => {
  test('Add Admin to PublicGroup', async () => {
    const data = {id:'testgroup', tag:'test'};
    const newGroup = new PublicGroup(data);
    await newGroup.save();

    const user_data = {id:'testuser', password:'Test_user123'};
    const newUser = new User(user_data);
    await newUser.save();
		// Success
    const res = await request(webapp).post('/api/publicgroup/testgroup/admin').send({userID:'testuser'});
		expect(res.status).toBe(200);
    const result = await PublicGroup.findOne({ id: 'testgroup' });
    expect(result.admins.length).toBe(1);
  });
});

describe('Delete Deletion Request of PublicGroup', () => {
  test('Delete Deletion Request of PublicGroup', async () => {
    const data = {id:'testgroup', tag:'test', admins: ['testuser']};
    const newGroup = new PublicGroup(data);
    await newGroup.save();
		// Success
    const res = await request(webapp).delete('/api/publicgroup/testgroup/admin').send({userID:'testuser'});
		expect(res.status).toBe(200);
    const result = await PublicGroup.findOne({ id: 'testgroup' });
    expect(result.deletionRequest.length).toBe(0);
  });
});