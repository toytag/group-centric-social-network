/* eslint-disable no-undef */
import React from 'react';
import {
  render, screen, cleanup, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';

import UserPage from '../pages/UserPage/UserPage';

describe('UserPage', () => {
  test('correct render', () => {
    render(
      <MemoryRouter>
        <UserPage />
      </MemoryRouter>,
    );
  });
});
