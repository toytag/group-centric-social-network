/* eslint-disable no-undef */
import React from 'react';
import {
  render, screen, cleanup, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';

import PublicGroup from '../pages/PublicGroup/PublicGroup';

describe('PublicGroup', () => {
  test('correct render', () => {
    render(
      <MemoryRouter>
        <PublicGroup />
      </MemoryRouter>,
    );
  });
});
