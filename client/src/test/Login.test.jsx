/* eslint-disable no-undef */
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Login from '../pages/Login/Login';

test('correct Handling', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>,
  );
  const StartBtn = document.querySelector('[testid=Login]');
  StartBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
});

test('correct display', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>,
  );
  const linkElement1 = screen.getByText(/Sign in/i);
  expect(linkElement1).toBeInTheDocument();

  const linkElement2 = screen.getByText(/New User/i);
  expect(linkElement2).toBeInTheDocument();
});

it('Login Successfully', async () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>,
  );
  const username = document.querySelector('[testid=Username]');
  userEvent.type(username, 'Diablo');

  const pswd = document.querySelector('[testid=Password]');
  userEvent.type(pswd, '123');

  userEvent.click(document.querySelector('[testid=Login]'));
  await waitFor(() => expect(window.location.pathname).toBe('/'));
});
