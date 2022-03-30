/* eslint-disable */
const request = require('supertest');
const mongoose = require('mongoose');
const webapp = require('../server');
const PublicPost = require('../models/PublicPost');
const Group = require('../models/PublicGroup');
const User = require('../models/User');

let db;
const clearDatabase = async () => {
  try {
    const result = await PublicPost.deleteOne({group:'testgroup', author:'testuser'});
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

describe('get All PublicPosts', () => {
  test('get All PublicPosts', async () => {
    const data = {group:'testgroup', author:'testuser'};
    const newPost = new PublicPost(data);
    await newPost.save();
		// Success
    const res = await request(webapp).get('/api/publicpost/');
		expect(res.status).toBe(200);
  });
});

describe('Add Public Post', () => {
  test('Add Public Post', async () => {
    const group_data = {id:'testgroup', tag:'test', members:['testuser'], admins:['testuser']};
    const newGroup = new Group(group_data);
    await newGroup.save();

    const data = {group:'testgroup', author:'testuser', title:'test', content:'test@testuser', attachment:null};
    const res = await request(webapp).post('/api/publicpost/').send(data);
		expect(res.status).toBe(201);
  });
});

describe('get PublicPosts By Id', () => {
  test('get PublicPosts By Id', async () => {
    const data = {group:'testgroup', author:'testuser'};
    const newPost = new PublicPost(data);
    await newPost.save();
    const result = await PublicPost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;
    const res = await request(webapp).get(`/api/publicpost/${post_id}`);
		expect(res.status).toBe(200);
    expect(JSON.parse(res.text).group).toBe('testgroup');
  });
});

describe('delete PublicPosts By Id', () => {
  test('delete PublicPosts By Id (self)', async () => {
    const data = {group:'testgroup', author:'testuser', attachment: {fileID: null}};
    const newPost = new PublicPost(data);
    await newPost.save();
    const result = await PublicPost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;

    const user_data = {id:'testuser', password:'Test_user123', posts:[{postID: post_id}]};
    const newUser = new User(user_data);
    await newUser.save();

    const group_data = {id:'testgroup', tag:'test', members:['testuser'], posts:[post_id], deleted_number: 0};
    const newGroup = new Group(group_data);
    await newGroup.save();

    const res = await request(webapp).delete(`/api/publicpost/${post_id}`).send({type:'self'});
		expect(res.status).toBe(200);
    const result_2 = await PublicPost.findOne({ id: 'testgroup' });
    expect(result_2).toBe(null);
  });

  test('delete PublicPosts By Id (admin)', async () => {
    const data = {group:'testgroup', author:'testuser', attachment: {fileID: null}};
    const newPost = new PublicPost(data);
    await newPost.save();
    const result = await PublicPost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;

    const user_data = {id:'testuser', password:'Test_user123', posts:[{postID: post_id}]};
    const newUser = new User(user_data);
    await newUser.save();

    const group_data = {id:'testgroup', tag:'test', members:['testuser'], posts:[post_id], deleted_number: 0};
    const newGroup = new Group(group_data);
    await newGroup.save();

    const res = await request(webapp).delete(`/api/publicpost/${post_id}`).send({type:'admin'});
		expect(res.status).toBe(200);
    const result_2 = await PublicPost.findOne({ id: 'testgroup' });
    expect(result_2).toBe(null);
  });
});

describe('comment on PublicPost', () => {
  test('comment on PublicPost', async () => {
    const data = {group:'testgroup', author:'testuser'};
    const newPost = new PublicPost(data);
    await newPost.save();
    const result = await PublicPost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;

    const user_data = {id:'testuser', password:'Test_user123', posts:[{postID: post_id}]};
    const newUser = new User(user_data);
    await newUser.save();

    const group_data = {id:'testgroup', tag:'test', members:['testuser'], posts:[post_id], deleted_number: 0};
    const newGroup = new Group(group_data);
    await newGroup.save();

    const res = await request(webapp).post(`/api/publicpost/${post_id}/comment`).send({userID:'testuser', text:'test@testuser', groupID:'testgroup'});
		expect(res.status).toBe(200);
    const result_2 = await PublicPost.findOne({group:'testgroup', author:'testuser'});
    expect(result_2.comments.length).toBe(1);
  });
});

describe('delete comment on PublicPost', () => {
  test('delete comment on PublicPost', async () => {
    const data = {group:'testgroup', author:'testuser', comments: [{author:'testuser', date:20211213}]};
    const newPost = new PublicPost(data);
    await newPost.save();
    const result = await PublicPost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;

    const res = await request(webapp).delete(`/api/publicpost/${post_id}/comment`).send({userID:'testuser', date:20211213});
		expect(res.status).toBe(200);
    const result_2 = await PublicPost.findOne({group:'testgroup', author:'testuser'});
    expect(result_2.comments.length).toBe(0);
  });
});

describe('Add flag on PublicPost', () => {
  test('Add flag on PublicPost', async () => {
    const data = {group:'testgroup', author:'testuser'};
    const newPost = new PublicPost(data);
    await newPost.save();
    const result = await PublicPost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;

    const res = await request(webapp).post(`/api/publicpost/${post_id}/flag`).send({userID:'testuser'});
		expect(res.status).toBe(200);
    const result_2 = await PublicPost.findOne({group:'testgroup', author:'testuser'});
    expect(result_2.flags.length).toBe(1);
  });
});

describe('Delete flag on PublicPost', () => {
  test('Delete flag on PublicPost', async () => {
    const data = {group:'testgroup', author:'testuser', flags:['testuser']};
    const newPost = new PublicPost(data);
    await newPost.save();
    const result = await PublicPost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;
    
    const res = await request(webapp).delete(`/api/publicpost/${post_id}/flag`).send({userID:'testuser'});
		expect(res.status).toBe(200);
    const result_2 = await PublicPost.findOne({group:'testgroup', author:'testuser'});
    expect(result_2.flags.length).toBe(0);
  });
});
