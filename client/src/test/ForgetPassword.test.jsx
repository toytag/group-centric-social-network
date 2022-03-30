/* eslint-disable no-undef */
import React from 'react';
import {
  render, screen, cleanup, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';

import ForgetPassword from '../pages/Login/ForgetPassword';

describe('ForgetPassword', () => {
  test('correct render', () => {
    render(
      <MemoryRouter>
        <ForgetPassword />
      </MemoryRouter>,
    );
    const linkElement1 = screen.getByText(/If you forget the password/i);
    expect(linkElement1).toBeInTheDocument();
  });
});
