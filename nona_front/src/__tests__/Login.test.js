import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../Components/Login';
import { MemoryRouter } from 'react-router-dom';
import * as router from 'react-router'
const navigate = jest.fn()
import BusServerConnector from '../ServerConnector';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter as Router} from 'react-router-dom';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    googleLogin: jest.fn(),
    setCertified: jest.fn(),
    certified: true
  })
}));

// jest.mock('react-router-dom', () => ({
//   Link: ({ to, children }) => <a href={to}>{children}</a>,
//   useNavigate: () => jest.fn()
// }));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

describe('Login component', () => {
  test('renders login form', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
      
    );
    // expect(screen.getByLabelText('emai')).toBeInTheDocument();
    // expect(screen.getByLabelText('pass')).toBeInTheDocument();
    // expect(getByRole('button', { name: 'Log In' })).toBeInTheDocument();
    // expect(screen.getByText('Forgot Password ?')).toBeInTheDocument();
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password(Minimum Length : 6)');
    const loginButton = screen.getByText('Log In');
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test('submits login form', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    let connector = BusServerConnector.getInstance();
    const mock = jest.spyOn(connector, 'set_api_key');  // spy on foo
    mock.mockImplementation((token)=>true);  // replace implementation
    const mock1 = jest.spyOn(connector, 'get_api_key');  // spy on foo
    mock1.mockImplementation(()=>"40a7bbc67d32584d8125bf7990b8805ca1b2e8893bf5533965c18a0045a0443c");  // replace implementation

    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password(Minimum Length : 6)');
    const loginButton = screen.getByText('Log In');
  
    fireEvent.change(emailInput, { target: { value: 'kjiang1117@jhu.edu' } });
    fireEvent.change(passwordInput, { target: { value: 'jkqbye' } });
    fireEvent.click(loginButton);
  
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/CompanyPage/MainPage');
      expect(screen.getByText('Access to our website')).toBeInTheDocument();
    });
    
    mock.mockRestore(); 
  });

  
});


