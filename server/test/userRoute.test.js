const request = require('supertest');
const webapp = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const PublicGroup = require('../models/PublicGroup');
const PublicPost = require('../models/PublicPost');
const PrivateGroup = require('../models/PrivateGroup');
const PrivatePost = require('../models/PrivatePost');

let db;
const clearDatabase = async () => {
  try {
    const result = await User.deleteOne({ id: 'testuser' });

    const result_2 = await PublicPost.findOne({ id: 'testuser' });
    if (result_2 != null) {
      await PublicPost.deleteOne({group:'testgroup', author:'testuser'})
    }

    const result_3 = await PublicGroup.findOne({ id: 'testgroup' });
    if (result_3 != null) {
      await PublicGroup.deleteOne({ id: 'testgroup' });
    }

    const result_4 = await PrivatePost.findOne({ id: 'testuser' });
    if (result_4 != null) {
      await PrivatePost.deleteOne({group:'testgroup', author:'testuser'})
    }

    const result_5 = await PrivateGroup.findOne({ id: 'testgroup' });
    if (result_5 != null) {
      await PrivateGroup.deleteOne({ id: 'testgroup' })
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

describe('Gets all users information', () => {
  test('Get All users', async () => {
		const data = {id:'testuser', password:'Test_user123', attempts:0};
    const newUser = new User(data);
    await newUser.save();
		// Success
    const res = await request(webapp).get('/api/user/').send({id:'testuser', password:'Test_user123'});
		expect(res.status).toBe(200);
  });
});

describe('Creates / adds a new user', () => {
  test('Register a new user successfully', async () => {
		const data = {id:'testuser', password:'Test_user123'};
    const res = await request(webapp).post('/api/user/').send(data);
		expect(res.status).toBe(201);
    expect(JSON.parse(res.text).msg).toBe('Success.');
  });

  test('User already exist', async () => {
		const data = {id:'testuser', password:'Test_user123'};
    const newUser = new User(data);
    await newUser.save();
    const res = await request(webapp).post('/api/user/').send(data);
		expect(res.status).toBe(409);
    expect(JSON.parse(res.text).msg).toBe('Username existed.');
  });
});

describe('Gets a users information', () => {
  test('Get user', async () => {
		const data = {id:'testuser', password:'Test_user123', attempts:0};
    const newUser = new User(data);
    await newUser.save();
		// Success
    const res = await request(webapp).get('/api/user/testuser');
		expect(res.status).toBe(200);
    expect(JSON.parse(res.text).id).toBe('testuser');
  });

  test('Get user failed', async () => {
		// fail
    const res = await request(webapp).get('/api/user/testuser');
		expect(res.status).toBe(404);
    expect(JSON.parse(res.text).msg).toBe('User not found.');
  });
});

describe('change a users password', () => {
  test('changePswd successfully', async () => {
		const data = {id:'testuser', password:'Test_user123', attempts:0};
    const newUser = new User(data);
    await newUser.save();
		// Success
    const res = await request(webapp).put('/api/user/testuser/password').send({id:'testuser', oldPassword:'Test_user123', password:'Test_user124'});
		expect(res.status).toBe(200);
  });

  test('changePswd failed', async () => {
		const data = {id:'testuser', password:'Test_user123', attempts:0};
    const newUser = new User(data);
    await newUser.save();
		// Success
    const res = await request(webapp).put('/api/user/testuser/password').send({id:'testuser', oldpassword:'Test_user124', password:'Test_user124'});
		expect(res.status).toBe(400);
    expect(JSON.parse(res.text).msg).toBe('Wrong Password');
  });
});

describe('Creates / adds a post', () => {
  test('addPost', async () => {
		const data = {id:'testuser', password:'Test_user123', attempts:0};
    const newUser = new User(data);
    await newUser.save();
		// Success
    const res = await request(webapp).post('/api/user/testuser/post').send({postID:1, postType: 'public'});
		expect(res.status).toBe(200);
    const result = await User.findOne({ id: 'testuser' });
    expect(result.posts.length).toBe(1);
  });
});

describe('Gets a Users Posts', () => {
  test('getAllPostsofUser successfully(public)', async () => {
    const post = {group:'testgroup', author:'testuser', attachment: {fileID: null}};
    const newPost = new PublicPost(post);
    await newPost.save();
    const result = await PublicPost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;

		const data = {id:'testuser', password:'Test_user123', attempts:0, posts: [{postID:post_id, postType:'public'}]};
    const newUser = new User(data);
    await newUser.save();
		// Success
    const res = await request(webapp).get('/api/user/testuser/post');
		expect(res.status).toBe(200);
  });

  test('getAllPostsofUser successfully(private)', async () => {
    const post = {group:'testgroup', author:'testuser', attachment: {fileID: null}};
    const newPost = new PrivatePost(post);
    await newPost.save();
    const result = await PrivatePost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;

		const data = {id:'testuser', password:'Test_user123', attempts:0, posts: [{postID:post_id, postType:'private'}]};
    const newUser = new User(data);
    await newUser.save();
		// Success
    const res = await request(webapp).get('/api/user/testuser/post');
		expect(res.status).toBe(200);
  });
});

describe('Creates / adds a publicgroup', () => {
  test('addPublicgroup successfully', async () => {
		const data = {id:'testuser', password:'Test_user123', attempts:0};
    const newUser = new User(data);
    await newUser.save();
		// Success
    const res = await request(webapp).post('/api/user/testuser/publicgroup').send({groupID: 'testgroup'});
		expect(res.status).toBe(200);
    const result = await User.findOne({ id: 'testuser' });
    expect(result.publicgroups.length).toBe(1);
  });
});

describe('Creates / adds a privategroup', () => {
  test('addPrivategroup successfully', async () => {
		const data = {id:'testuser', password:'Test_user123', attempts:0};
    const newUser = new User(data);
    await newUser.save();
		// Success
    const res = await request(webapp).post('/api/user/testuser/privategroup').send({groupID: 'testgroup'});
		expect(res.status).toBe(200);
    const result = await User.findOne({ id: 'testuser' });
    expect(result.privategroups.length).toBe(1);
  });
});

describe('Set a post to hidden', () => {
  test('hidePost successfully (public)', async () => {
    const post = {group:'testgroup', author:'testuser', attachment: {fileID: null}};
    const newPost = new PublicPost(post);
    await newPost.save();
    const result = await PublicPost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;

    const user_data = {id:'testuser', password:'Test_user123', publicgroups:['testgroup'], posts:[post_id], hidden_number:0};
    const newUser = new User(user_data);
    await newUser.save();

    const group_data = {id:'testgroup', tag:'test', members:['testuser'], posts:[post_id], hidden_number:2};
    const newGroup = new PublicGroup(group_data);
    await newGroup.save();
		// Success
    const res = await request(webapp).post('/api/user/testuser/hidden').send({postID:post_id, groupID: 'testgroup', groupType:'public'});
		expect(res.status).toBe(200);
  });

  test('hidePost successfully (private)', async () => {
    const post = {group:'testgroup', author:'testuser', attachment: {fileID: null}};
    const newPost = new PrivatePost(post);
    await newPost.save();
    const result = await PrivatePost.findOne({group:'testgroup', author:'testuser'});
    const post_id = result._id;

    const user_data = {id:'testuser', password:'Test_user123',privategroups:['testgroup'], posts:[post_id], hidden_number:0};
    const newUser = new User(user_data);
    await newUser.save();

    const group_data = {id:'testgroup', tag:'test', members:['testuser'], posts:[post_id], hidden_number:2};
    const newGroup = new PrivateGroup(group_data);
    await newGroup.save();
		// Success
    const res = await request(webapp).post('/api/user/testuser/hidden').send({postID:post_id, groupID: 'testgroup', groupType:'private'});
		expect(res.status).toBe(200);
  });
});

describe('Gets a Users notificationNumber', () => {
  test('getNotificationNumber successfully', async () => {
		const data = {id:'testuser', password:'Test_user123', notifications:[]};
    const newUser = new User(data);
    await newUser.save();
		// Success
    const res = await request(webapp).get('/api/user/testuser/notificationNumber');
		expect(res.status).toBe(200);
    expect(JSON.parse(res.text)).toBe(0);
  });
});

describe('Delete a notfication', () => {
  test('Delete a notfication successfully', async () => {
		const data = {id:'testuser', password:'Test_user123', notifications:[{id:1}]};
    const newUser = new User(data);
    await newUser.save();
		// Success
    const res = await request(webapp).delete('/api/user/testuser/notification').send({notificationID:1});
		expect(res.status).toBe(200);
    const result = await User.findOne({ id: 'testuser' });
    expect(result.notifications.length).toBe(0);
  });
});

describe('get conversations', () => {
  test('get conversations successfully', async () => {
		const data = {id:'testuser', password:'Test_user123', conversations:[]};
    const newUser = new User(data);
    await newUser.save();
		// Success
    const res = await request(webapp).get('/api/user/testuser/conversations');
		expect(res.status).toBe(200);
  });
});

describe('test', () => {
  test('test', async () => {
		const data = {id:'testuser'};
    const newUser = new User(data);
    await newUser.save();

    const res = await request(webapp).delete('/api/user/test').send(data);
		expect(res.status).toBe(201);
    expect(JSON.parse(res.text).msg).toBe('Success.');
  });

  test('test', async () => {
		const data = {id:'testuser', password:'Test_user123'};
    const res = await request(webapp).post('/api/user/test').send(data);
		expect(res.status).toBe(201);
    expect(JSON.parse(res.text).msg).toBe('Success.');
  });
});
