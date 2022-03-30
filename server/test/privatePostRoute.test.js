/* eslint-disable */
const request = require('supertest');
const mongoose = require('mongoose');
const webapp = require('../server');
const PrivatePost = require('../models/PrivatePost');
const Group = require('../models/PrivateGroup');
const User = require('../models/User');

let db;
const clearDatabase = async () => {
  try {
    const result = await PrivatePost.deleteOne({group:'testgroup', author:'testuser'});
    const result_2 = await User.findOne({ id: 'testuser' });
    if (result_2 != null) {
      await User.deleteOne({ id: 'testuser' });
      console.log('info', 'Successfully deleted user');
    }
    const result_3 = await Group.findOne({ id: 'testgroup' });
    if (result_3 != null) {
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

describe('get All PrivatePosts', () => {
  test('get All PrivatePosts', async () => {
    const data = {group:'testgroup', author:'testuser'};
    const newPost = new PrivatePost(data);
    await newPost.save();
		// Success
    const res = await request(webapp).get('/api/privatepost/');
		expect(res.status).toBe(200);
  });
});

describe('Add Private Post', () => {
  test('Add Private Post', async () => {
    const group_data = {id:'testgroup', tag:'test', members:['testuser'], admins:['testuser']};
    const newGroup = new Group(group_data);
    await newGroup.save();

    const data = {group:'testgroup', author:'testuser', title:'test', content:'test@testuser', attachment:null};
    const res = await request(webapp).post('/api/privatepost/').send(data);
		expect(res.status).toBe(201);
  });
});

describe('get PrivatePosts By Id', () => {
  test('get PrivatePosts By Id', async () => {
    const data = {group:'testgroup', author:'testuser'};
    const newPost = new PrivatePost(data);
    await newPost.save();
    const result = await PrivatePost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;
    const res = await request(webapp).get(`/api/privatepost/${post_id}`);
		expect(res.status).toBe(200);
    expect(JSON.parse(res.text).group).toBe('testgroup');
  });
});

describe('delete PrivatePosts By Id', () => {
  test('delete PrivatePosts By Id (self)', async () => {
    const data = {group:'testgroup', author:'testuser', attachment: {fileID: null}};
    const newPost = new PrivatePost(data);
    await newPost.save();
    const result = await PrivatePost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;

    const user_data = {id:'testuser', password:'Test_user123', posts:[{postID: post_id}]};
    const newUser = new User(user_data);
    await newUser.save();

    const group_data = {id:'testgroup', tag:'test', members:['testuser'], posts:[post_id], deleted_number: 0};
    const newGroup = new Group(group_data);
    await newGroup.save();

    const res = await request(webapp).delete(`/api/privatepost/${post_id}`).send({type:'self'});
		expect(res.status).toBe(200);
    const result_2 = await PrivatePost.findOne({ id: 'testgroup' });
    expect(result_2).toBe(null);
  });

  test('delete PrivatePosts By Id (admin)', async () => {
    const data = {group:'testgroup', author:'testuser', attachment: {fileID: null}};
    const newPost = new PrivatePost(data);
    await newPost.save();
    const result = await PrivatePost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;

    const user_data = {id:'testuser', password:'Test_user123', posts:[{postID: post_id}]};
    const newUser = new User(user_data);
    await newUser.save();

    const group_data = {id:'testgroup', tag:'test', members:['testuser'], posts:[post_id], deleted_number: 0};
    const newGroup = new Group(group_data);
    await newGroup.save();

    const res = await request(webapp).delete(`/api/privatepost/${post_id}`).send({type:'admin'});
		expect(res.status).toBe(200);
    const result_2 = await PrivatePost.findOne({ id: 'testgroup' });
    expect(result_2).toBe(null);
  });
});

describe('comment on PrivatePost', () => {
  test('comment on PrivatePost', async () => {
    const data = {group:'testgroup', author:'testuser'};
    const newPost = new PrivatePost(data);
    await newPost.save();
    const result = await PrivatePost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;

    const user_data = {id:'testuser', password:'Test_user123', posts:[{postID: post_id}]};
    const newUser = new User(user_data);
    await newUser.save();

    const group_data = {id:'testgroup', tag:'test', members:['testuser'], posts:[post_id], deleted_number: 0};
    const newGroup = new Group(group_data);
    await newGroup.save();

    const res = await request(webapp).post(`/api/privatepost/${post_id}/comment`).send({userID:'testuser', text:'test@testuser', groupID:'testgroup'});
		expect(res.status).toBe(200);
    const result_2 = await PrivatePost.findOne({group:'testgroup', author:'testuser'});
    expect(result_2.comments.length).toBe(1);
  });
});

describe('delete comment on PrivatePost', () => {
  test('delete comment on PrivatePost', async () => {
    const data = {group:'testgroup', author:'testuser', comments: [{author:'testuser', date:20211213}]};
    const newPost = new PrivatePost(data);
    await newPost.save();
    const result = await PrivatePost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;

    const res = await request(webapp).delete(`/api/privatepost/${post_id}/comment`).send({userID:'testuser', date:20211213});
		expect(res.status).toBe(200);
    const result_2 = await PrivatePost.findOne({group:'testgroup', author:'testuser'});
    expect(result_2.comments.length).toBe(0);
  });
});

describe('Add flag on PrivatePost', () => {
  test('Add flag onPrivatePost', async () => {
    const data = {group:'testgroup', author:'testuser'};
    const newPost = new PrivatePost(data);
    await newPost.save();
    const result = await PrivatePost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;

    const res = await request(webapp).post(`/api/privatepost/${post_id}/flag`).send({userID:'testuser'});
		expect(res.status).toBe(200);
    const result_2 = await PrivatePost.findOne({group:'testgroup', author:'testuser'});
    expect(result_2.flags.length).toBe(1);
  });
});

describe('Delete flag on PrivatePost', () => {
  test('Delete flag on PrivatePost', async () => {
    const data = {group:'testgroup', author:'testuser', flags:['testuser']};
    const newPost = new PrivatePost(data);
    await newPost.save();
    const result = await PrivatePost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;
    
    const res = await request(webapp).delete(`/api/privatepost/${post_id}/flag`).send({userID:'testuser'});
		expect(res.status).toBe(200);
    const result_2 = await PrivatePost.findOne({group:'testgroup', author:'testuser'});
    expect(result_2.flags.length).toBe(0);
  });
});