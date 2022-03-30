/* eslint-disable no-undef */
import React from 'react';
import {
  render, screen, cleanup, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';

import Home from '../pages/Home';
import * as fetchPost from '../utils/fetchPublicPost';
import * as fetchGroup from '../utils/fetchPublicGroup';
import * as fetchUser from '../utils/fetchUser';

jest.mock('../utils/fetchPublicPost');
jest.mock('../utils/fetchPublicGroup');
jest.mock('../utils/fetchUser');

const posts = [
  {
    _id: '61b58225e3b6f3b3455f55f9',
    group: 'aaaa',
    author: 'tzz',
    date: 1639285285246,
    title: 'lala',
    content: 'lala',
    attachment: { fileID: null, fileType: null },
    comments: [],
    flags: [],
    type: 'publicpost',
    hashtags: [],
  },
  {
    _id: '61b8d58329820a7f371b4fa6',
    group: 'aaaa',
    author: 'abc',
    date: 1639503235232,
    title: "Maybe I'll try post here",
    content: 'Something not important',
    attachment: { fileID: null, fileType: null },
    comments: [],
    flags: [],
    type: 'publicpost',
    hashtags: [],
  },
];

const groups = [
  {
    _id: '61b58185e3b6f3b3455f55cb',
    id: 'aaaa',
    tag: 'life',
    creator: 'tzz',
    admins: ['tzz', 'abc'],
    members: ['tzz', 'abc'],
    posts: [
      '61b58225e3b6f3b3455f55f9',
      '61b8d58329820a7f371b4fa6',
    ],
    joinRequest: [],
    deletionRequest: [],
    deleted_number: 0,
    hidden_number: 0,
  },
];

const users = [
  {
    _id: '61b5804ae3b6f3b3455f55bc',
    id: 'tzz',
    password: 'VHp6MTIzNDU2IQ==',
    register_date: 1639284810188,
    attempts: 0,
    last_attempt: 1640036305229,
    posts: [
      {
        postID: '61b58225e3b6f3b3455f55f9',
        postType: 'public',
      },
    ],
    publicgroups: ['aaaa'],
    privategroups: [],
    notifications: [],
    hidden: [],
    conversations: [
      {
        chatID: '61b59a20e3b6f3b3455f56ec',
        chatTo: 'abc',
        last_date: 1640036501405,
      },
    ],
  },
  {
    _id: '61b59a08e3b6f3b3455f56b4',
    id: 'abc',
    password: 'VHp6MTIzNDU2IQ==',
    register_date: 1639291400281,
    attempts: 0,
    last_attempt: 1639527711100,
    posts: [
      {
        postID: '61b8d58329820a7f371b4fa6',
        postType: 'public',
      },
    ],
    publicgroups: ['aaaa'],
    privategroups: [],
    notifications: [],
    hidden: [],
    conversations: [
      {
        chatID: '61b59a20e3b6f3b3455f56ec',
        chatTo: 'tzz',
        last_date: 1640036501409,
      },
    ],
  },
];

beforeEach(async () => {
  fetchPost.fetchPopularPostId.mockResolvedValue([posts[0]._id]);
  fetchPost.fetchPost.mockResolvedValue(posts[0]);
  fetchGroup.fetchAllPublicGroups.mockResolvedValue(groups);
  fetchGroup.fetchGroup.mockResolvedValue(groups[0]);
  fetchGroup.fetchSuggestedGroup.mockResolvedValue(groups[0]);
  fetchGroup.fetchGroupPost.mockResolvedValue(posts[0]);
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('Home', () => {
  test('should render Home page', async () => {
    await waitFor(() => render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    ));
  });
});
