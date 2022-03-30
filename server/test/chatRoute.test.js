const request = require('supertest');
const webapp = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const FileSystem = require('../models/FileSystem');
const Message = require('../models/Message');
const ChatThread = require('../models/ChatThread');

let db;
const clearDatabase = async () => {
  try {
    await User.deleteOne({ id: 'testuser_1' });
    await User.deleteOne({ id: 'testuser_2' });
    const result = await ChatThread.findOne({ users: { $all: ['testuser_2', 'testuser_2'] } });
    if (result != null) {
      await ChatThread.deleteOne({ users: { $all: ['testuser_2', 'testuser_2'] } });
    }

    const result_2 = await Message.findOne({from:'testuser_1', to:'testuser_2'});
    if (result_2 != null) {
      await Message.deleteOne({from:'testuser_1', to:'testuser_2'});
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

describe('check validation', () => {
  test('check validation (valid)', async () => {
		const user_data_1 = {id:'testuser_1', password:'Test_user123', publicgroups:['testgroup']};
    const newUser_1 = new User(user_data_1);
    await newUser_1.save();

    const user_data_2 = {id:'testuser_2', password:'Test_user123', publicgroups:['testgroup']};
    const newUser_2 = new User(user_data_2);
    await newUser_2.save();
		// Success
    const res = await request(webapp).post('/api/chat/check').send({initiator:'testuser_1', recipient:'testuser_2'});
		expect(res.status).toBe(200);
  });

  test('check validation (valid)', async () => {
		const user_data_1 = {id:'testuser_1', password:'Test_user123', privategroups:['testgroup']};
    const newUser_1 = new User(user_data_1);
    await newUser_1.save();

    const user_data_2 = {id:'testuser_2', password:'Test_user123', privategroups:['testgroup']};
    const newUser_2 = new User(user_data_2);
    await newUser_2.save();
		// Success
    const res = await request(webapp).post('/api/chat/check').send({initiator:'testuser_1', recipient:'testuser_2'});
		expect(res.status).toBe(200);
  });

  test('check validation (invalid)', async () => {
		const user_data_1 = {id:'testuser_1', password:'Test_user123', publicgroups:['testgroup']};
    const newUser_1 = new User(user_data_1);
    await newUser_1.save();

    const user_data_2 = {id:'testuser_2', password:'Test_user123', publicgroups:['']};
    const newUser_2 = new User(user_data_2);
    await newUser_2.save();
		// Success
    const res = await request(webapp).post('/api/chat/check').send({initiator:'testuser_1', recipient:'testuser_2'});
		expect(res.status).toBe(401);
  });
});

describe('post chat', () => {
  test('post chat', async () => {
		const chat_data = {users: ['testuser_1', 'testuser_2']};
    const newChat = new ChatThread(chat_data);
    await newChat.save();
    const result = await ChatThread.findOne({ users: { $all: ['testuser_1', 'testuser_2'] } });
    const chat_id = result._id;

    const user_data_1 = {id:'testuser_1', password:'Test_user123', publicgroups:['testgroup'], conversations:[{chatID:chat_id.toString()}]};
    const newUser_1 = new User(user_data_1);
    await newUser_1.save();

    const user_data_2 = {id:'testuser_2', password:'Test_user123', publicgroups:['testgroup']};
    const newUser_2 = new User(user_data_2);
    await newUser_2.save();

		// Success
    const res = await request(webapp).post('/api/chat/').send({initiator:'testuser_1', recipient:'testuser_2'});
		expect(res.status).toBe(201);
  });

  test('post chat (add new chat thread)', async () => {
    const user_data_1 = {id:'testuser_1', password:'Test_user123', publicgroups:['testgroup'], conversations:[]};
    const newUser_1 = new User(user_data_1);
    await newUser_1.save();

    const user_data_2 = {id:'testuser_2', password:'Test_user123', publicgroups:['testgroup']};
    const newUser_2 = new User(user_data_2);
    await newUser_2.save();

		// Success
    const res = await request(webapp).post('/api/chat/').send({initiator:'testuser_1', recipient:'testuser_2'});
		expect(res.status).toBe(201);
  });
});

describe('post chat by chat id', () => {
  test('post chat by chat id', async () => {
		const chat_data = {users: ['testuser_1', 'testuser_2']};
    const newChat = new ChatThread(chat_data);
    await newChat.save();
    const result = await ChatThread.findOne({ users: { $all: ['testuser_1', 'testuser_2'] } });
    const chat_id = result._id;

    const user_data_1 = {id:'testuser_1', password:'Test_user123', publicgroups:['testgroup'], conversations:[{chatID:chat_id.toString(), last_date:1}]};
    const newUser_1 = new User(user_data_1);
    await newUser_1.save();

    const user_data_2 = {id:'testuser_2', password:'Test_user123', publicgroups:['testgroup']};
    const newUser_2 = new User(user_data_2);
    await newUser_2.save();

		// Success
    const res = await request(webapp).post(`/api/chat/${chat_id}`).send({messageID:'001', from:'testuser_1', to:'testuser_2'});
		expect(res.status).toBe(200);
  });

  test('post chat by chat id', async () => {
    const chat_id = mongoose.Types.ObjectId('578df3efb618f5141202a196');

    const user_data_1 = {id:'testuser_1', password:'Test_user123', publicgroups:['testgroup'], conversations:[]};
    const newUser_1 = new User(user_data_1);
    await newUser_1.save();

    const user_data_2 = {id:'testuser_2', password:'Test_user123', publicgroups:['testgroup']};
    const newUser_2 = new User(user_data_2);
    await newUser_2.save();

		// Success
    const res = await request(webapp).post(`/api/chat/${chat_id}`).send({messageID:'001', from:'testuser_1', to:'testuser_3'});
		expect(res.status).toBe(404);
  });
});

describe('delete chat by chat id', () => {
  test('delete chat by chat id', async () => {
    const message_data = {from:'testuser_1', to:'testuser_2', type:'text'};
    const newMessage = new Message(message_data);
    await newMessage.save();
    const result = await Message.findOne({from:'testuser_1', to:'testuser_2'});
    const message_id = result._id;

		const chat_data = {users: ['testuser_1', 'testuser_2'], messages:[message_id]};
    const newChat = new ChatThread(chat_data);
    await newChat.save();
    const result_2 = await ChatThread.findOne({ users: { $all: ['testuser_1', 'testuser_2'] } });
    const chat_id = result_2._id;

    const user_data_1 = {id:'testuser_1', password:'Test_user123', publicgroups:['testgroup'], conversations:[{chatID:chat_id.toString(), last_date:1}]};
    const newUser_1 = new User(user_data_1);
    await newUser_1.save();

    const user_data_2 = {id:'testuser_2', password:'Test_user123', publicgroups:['testgroup']};
    const newUser_2 = new User(user_data_2);
    await newUser_2.save();

		// Success
    const res = await request(webapp).delete(`/api/chat/${chat_id}`).send({userID:'testuser_1'});
		expect(res.status).toBe(200);
  });

  test('delete chat by chat id', async () => {
    const chat_id = mongoose.Types.ObjectId('578df3efb618f5141202a196');

    const user_data_1 = {id:'testuser_1', password:'Test_user123', publicgroups:['testgroup'], conversations:[{chatID:chat_id.toString(), last_date:1}]};
    const newUser_1 = new User(user_data_1);
    await newUser_1.save();

    const user_data_2 = {id:'testuser_2', password:'Test_user123', publicgroups:['testgroup']};
    const newUser_2 = new User(user_data_2);
    await newUser_2.save();

		// Success
    const res = await request(webapp).delete(`/api/chat/${chat_id}`).send({userID:'testuser_1'});
		expect(res.status).toBe(404);
  });
});

describe('get chat by chat id', () => {
  test('get chat by chat id', async () => {
		const message_data = {from:'testuser_1', to:'testuser_2', type:'text'};
    const newMessage = new Message(message_data);
    await newMessage.save();
    const result = await Message.findOne({from:'testuser_1', to:'testuser_2'});
    const message_id = result._id;

		const chat_data = {users: ['testuser_1', 'testuser_2'], messages:[message_id]};
    const newChat = new ChatThread(chat_data);
    await newChat.save();
    const result_2 = await ChatThread.findOne({ users: { $all: ['testuser_1', 'testuser_2'] } });
    const chat_id = result_2._id;

    const user_data_1 = {id:'testuser_1', password:'Test_user123', publicgroups:['testgroup'], conversations:[{chatID:chat_id.toString(), last_date:1}]};
    const newUser_1 = new User(user_data_1);
    await newUser_1.save();

    const user_data_2 = {id:'testuser_2', password:'Test_user123', publicgroups:['testgroup']};
    const newUser_2 = new User(user_data_2);
    await newUser_2.save();

		// Success
    const res = await request(webapp).get(`/api/chat/${chat_id}`);
		expect(res.status).toBe(200);
  });
});