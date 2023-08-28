import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Signup from '../Components/Signup';
import Mobile from '../Mobile';
import {
    createMemoryRouter,
    RouterProvider,
    useNavigate,
  } from 'react-router-dom';

test('renders user sign up form', () => {
  render(
    <MemoryRouter>
        <Signup />
    </MemoryRouter>
  );
  const usernameInput = screen.getByLabelText('User Name');
  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password(Minimum Length : 6)');
  const confirmPasswordInput = screen.getByLabelText('Password Confirmation(Minimum Length : 6)');
  const submitButton = screen.getByText('Sign Up');
  expect(usernameInput).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(confirmPasswordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test('displays error message when passwords do not match', () => {
    render(
        <MemoryRouter>
            <Signup />
        </MemoryRouter>
      );
  const passwordInput = screen.getByLabelText('Password(Minimum Length : 6)');
  const confirmPasswordInput = screen.getByLabelText('Password Confirmation(Minimum Length : 6)');
  const submitButton = screen.getByText('Sign Up');
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
  fireEvent.click(submitButton);
  const errorMessage = screen.getByText('Passwords do not match');
  expect(errorMessage).toBeInTheDocument();
});


// Uncomment and modify this test if you want to test the API call with a mock
test('navigates to /mobile after successful signup', async () => {
    const setupMyTest = () => {
        const router = createMemoryRouter(
            [
            {
                path: '/mobile',
                element: <Mobile />,
            },
            {
                path: '/signup',
                // Render the component causing the navigate to '/'
                element: <Signup />,
            },
            ],
            {
            // Set for where you want to start in the routes. Remember, KISS (Keep it simple, stupid) the routes.
            initialEntries: ['/signup'],
            // We don't need to explicitly set this, but it's nice to have.
            initialIndex: 0,
            }
        )
        render(<RouterProvider router={router} />)

        // Objectify the router so we can explicitly pull when calling setupMyTest
        return { router }
    }
  const mockFetch = jest.fn(() => Promise.resolve({}));
  global.fetch = mockFetch;
//   render(
//     <MemoryRouter>
//         <Signup />
//     </MemoryRouter>
//   );
    const { router } = setupMyTest();
    expect(router.state.location.pathname).toEqual('/signup')
  const usernameInput = screen.getByLabelText('User Name');
  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password(Minimum Length : 6)');
  const confirmPasswordInput = screen.getByLabelText('Password Confirmation(Minimum Length : 6)');
  const submitButton = screen.getByText('Sign Up');
  fireEvent.change(usernameInput, { target: { value: 'testuser1' } });
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
  fireEvent.click(submitButton);
  expect(mockFetch).toHaveBeenCalledWith('http://api.magicspica.com/api/users', {
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    body: JSON.stringify({ username: 'testuser1', password: 'password123', email: 'test@example.com' }),
  });
  await waitFor(() => {
    expect(router.state.location.pathname).toEqual('/mobile')
  })
});