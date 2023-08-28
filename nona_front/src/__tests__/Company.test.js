import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import {
    createMemoryRouter,
    RouterProvider,
    useNavigate,
  } from 'react-router-dom';

import Company from '../Company';
import Navbar from 'react-bootstrap/Navbar';


describe('Company component', () => {
  it('renders the Company component', () => {
    render(
      <Router basename="/">
      <Company />
    </Router>
    );
    expect(screen.getByText('Main Page')).toBeInTheDocument();
    expect(screen.getByText('Records')).toBeInTheDocument();

  });
});






