/* eslint-disable */
const request = require('supertest');
const mongoose = require('mongoose');
const webapp = require('../server');
const PublicGroup = require('../models/PublicGroup');
const PublicPost = require('../models/PublicPost');
const PrivateGroup = require('../models/PrivateGroup');
const PrivatePost = require('../models/PrivatePost');
const User = require('../models/User');

const clearDatabase = async () => {
  try {
    let result = await User.deleteOne({ id: 'testuser' });

    result = await PrivatePost.findOne({group:'testgroup', author:'testuser'});
    if (result != null) {
      await PrivatePost.deleteOne({group:'testgroup', author:'testuser'});
      console.log('info', 'Successfully deleted post');
    }
    result = await PublicPost.findOne({group:'testgroup', author:'testuser'});
    if (result != null) {
      await PublicPost.deleteOne({group:'testgroup', author:'testuser'});
      console.log('info', 'Successfully deleted post');
    }

    result = await PublicGroup.findOne({id: 'testgroup'});
    if (result != null) {
      await PublicGroup.deleteOne({ id: 'testgroup' });
      console.log('info', 'Successfully deleted group');
    }
    result = await PrivateGroup.findOne({id: 'testgroup'});
    if (result != null) {
      await PrivateGroup.deleteOne({ id: 'testgroup' });
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

describe('Delete a notfication', () => {
  test('Delete a notfication', async () => {
    const user_data = {id:'testuser', password:'Test_user123', notifications:[{id:'001'}]};
    const newUser = new User(user_data);
    await newUser.save();

    const res = await request(webapp).delete('/api/notification/testuser').send({id:'001'});
		expect(res.status).toBe(200);
    const result = await User.findOne({ id:'testuser' });
    expect(result.notifications.length).toBe(0);
  });
});

describe('notify the admin when someone leave the group', () => {
  test('notify the admin when someone leave the group (public)', async () => {
    const user_data = {id:'testuser', password:'Test_user123'};
    const newUser = new User(user_data);
    await newUser.save();

    const group_data = {id:'testgroup', tag:'test', members:['testuser'], admins:['testuser']};
    const newGroup = new PublicGroup(group_data);
    await newGroup.save();

    const res = await request(webapp).post('/api/notification/testuser/exit').send({groupType:'public', groupID:'testgroup'});
		expect(res.status).toBe(200);
    const result = await User.findOne({ id:'testuser' });
    expect(result.notifications.length).toBe(1);
    expect(result.notifications[0].type).toBe('exit');
  });

  test('notify the admin when someone leave the group (private)', async () => {
    const user_data = {id:'testuser', password:'Test_user123'};
    const newUser = new User(user_data);
    await newUser.save();

    const group_data = {id:'testgroup', tag:'test', members:['testuser'], admins:['testuser']};
    const newGroup = new PrivateGroup(group_data);
    await newGroup.save();

    const res = await request(webapp).post('/api/notification/testuser/exit').send({groupType:'private', groupID:'testgroup'});
		expect(res.status).toBe(200);
    const result = await User.findOne({ id:'testuser' });
    expect(result.notifications.length).toBe(1);
    expect(result.notifications[0].type).toBe('exit');
  });
});

describe('if the join request is handled by the admin, the user should be notified', () => {
  test('if the join request is handled by the admin, the user should be notified', async () => {
    const user_data = {id:'testuser', password:'Test_user123'};
    const newUser = new User(user_data);
    await newUser.save();

    const group_data = {id:'testgroup', tag:'test', members:['testuser']};
    const newGroup = new PublicGroup(group_data);
    await newGroup.save();

    const res = await request(webapp).post('/api/notification/testuser/joinReq').send({groupID:'testgroup', status:'approved'});
		expect(res.status).toBe(200);
    const result = await User.findOne({ id:'testuser' });
    expect(result.notifications.length).toBe(1);
    expect(result.notifications[0].type).toBe('joinReq');
  });
});

describe('if host invite guest to join a group, the guest should be notified', () => {
  test('if host invite guest to join a group, the guest should be notified', async () => {
    const user_data = {id:'testuser', password:'Test_user123'};
    const newUser = new User(user_data);
    await newUser.save();

    const group_data = {id:'testgroup', tag:'test', members:['testuser']};
    const newGroup = new PublicGroup(group_data);
    await newGroup.save();

    const res = await request(webapp).post('/api/notification/testuser/invite').send({hostID: 'testuser2', groupID:'testgroup', groupType:'public'});
		expect(res.status).toBe(200);
    const result = await User.findOne({ id:'testuser' });
    expect(result.notifications.length).toBe(1);
    expect(result.notifications[0].type).toBe('invite');
  });
});

describe('if guest accepts or rejects the invitation, the host should be notified', () => {
  test('if guest accepts or rejects the invitation, the host should be notified', async () => {
    const user_data = {id:'testuser', password:'Test_user123'};
    const newUser = new User(user_data);
    await newUser.save();

    const group_data = {id:'testgroup', tag:'test', members:['testuser']};
    const newGroup = new PublicGroup(group_data);
    await newGroup.save();

    const res = await request(webapp).post('/api/notification/testuser/inviteRes').send({guestID:'testuser2', groupID:'testgroup', status:'accepted'});
		expect(res.status).toBe(200);
    const result = await User.findOne({ id:'testuser' });
    expect(result.notifications.length).toBe(1);
    expect(result.notifications[0].type).toBe('inviteRes');
  });
});

describe('if user is promoted or revoked the admin, the user should be notified', () => {
  test('if user is promoted or revoked the admin, the user should be notified', async () => {
    const user_data = {id:'testuser', password:'Test_user123'};
    const newUser = new User(user_data);
    await newUser.save();

    const group_data = {id:'testgroup', tag:'test', members:['testuser']};
    const newGroup = new PublicGroup(group_data);
    await newGroup.save();

    const res = await request(webapp).post('/api/notification/testuser/admin').send({groupID:'testgroup', status:'promoted'});
		expect(res.status).toBe(200);
    const result = await User.findOne({ id:'testuser' });
    expect(result.notifications.length).toBe(1);
    expect(result.notifications[0].type).toBe('admin');
  });
});

describe('if the deletion request is rejected, the user should be notified', () => {
  test('if the deletion request is rejected, the user should be notified', async () => {
    const user_data = {id:'testuser', password:'Test_user123'};
    const newUser = new User(user_data);
    await newUser.save();

    const group_data = {id:'testgroup', tag:'test', members:['testuser']};
    const newGroup = new PublicGroup(group_data);
    await newGroup.save();

    const res = await request(webapp).post('/api/notification/testuser/delReqRejected').send({groupID:'testgroup'});
		expect(res.status).toBe(200);
    const result = await User.findOne({ id:'testuser' });
    expect(result.notifications.length).toBe(1);
    expect(result.notifications[0].type).toBe('delReq');
  });
});

describe('if the deletion request is approved, all users should be notified', () => {
  test('if the deletion request is approved, all users should be notified (public)', async () => {
    const data = {group:'testgroup', author:'testuser', flags:['testuser']};
    const newPost = new PublicPost(data);
    await newPost.save();
    const result = await PublicPost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;

    const user_data = {id:'testuser', password:'Test_user123', posts:[post_id]};
    const newUser = new User(user_data);
    await newUser.save();

    const group_data = {id:'testgroup', tag:'test', members:['testuser'], posts:[post_id]};
    const newGroup = new PublicGroup(group_data);
    await newGroup.save();

    const res = await request(webapp).post('/api/notification/delReqApproved').send({groupID:'testgroup', groupType:'public', postID:post_id});
		expect(res.status).toBe(200);
  });

  test('if the deletion request is approved, all users should be notified (private)', async () => {
    const data = {group:'testgroup', author:'testuser', flags:['testuser']};
    const newPost = new PrivatePost(data);
    await newPost.save();
    const result = await PrivatePost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;
    
    const user_data = {id:'testuser', password:'Test_user123', posts:[post_id]};
    const newUser = new User(user_data);
    await newUser.save();

    const group_data = {id:'testgroup', tag:'test', members:['testuser'], posts:[post_id]};
    const newGroup = new PrivateGroup(group_data);
    await newGroup.save();

    const res = await request(webapp).post('/api/notification/delReqApproved').send({groupID:'testgroup', groupType:'private', postID:post_id});
		expect(res.status).toBe(200);
  });

  test('error', async () => {
    const data = {group:'testgroup', author:'testuser', flags:['testuser']};
    const newPost = new PrivatePost(data);
    await newPost.save();
    const result = await PrivatePost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;

    const res = await request(webapp).post('/api/notification/delReqApproved').send({groupID:'testgroup', groupType:'wronge', postID:post_id});
		expect(res.status).toBe(400);
  });
});