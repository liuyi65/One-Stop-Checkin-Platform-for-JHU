import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../App';


describe('App component', () => {
  it('renders learn react link', () => {
    render(     
    <Router>
      <App />
    </Router>);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });
  it('renders the dashboard on the home page', async () => {
    render(
      <Router>
        <App />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('navigates to the login page when the user clicks the login link', async () => {
    render(
      <Router>
        <App />
      </Router>
    );

    const loginLink = screen.getByRole('link', { name: 'Login' });
    userEvent.click(loginLink);

    await waitFor(() => {
      expect(screen.getByText('Log In')).toBeInTheDocument();
    });
  });

  it('navigates to the signup page when the user clicks the signup link', async () => {
    render(
      <Router>
        <App />
      </Router>
    );

    const signupLink = screen.getByRole('link', { name: 'Sign Up' });
    userEvent.click(signupLink);

    await waitFor(() => {
      expect(screen.getByText('Create an Account')).toBeInTheDocument();
    });
  });

  it('navigates to the forgot password page when the user clicks the forgot password link', async () => {
    render(
      <Router>
        <App />
      </Router>
    );

    const forgotPasswordLink = screen.getByRole('link', { name: 'Forgot Password?' });
    userEvent.click(forgotPasswordLink);

    await waitFor(() => {
      expect(screen.getByText('Reset Password')).toBeInTheDocument();
    });
  });
});