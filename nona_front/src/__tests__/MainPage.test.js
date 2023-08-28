import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import {
    createMemoryRouter,
    RouterProvider,
    useNavigate,
  } from 'react-router-dom';

import MainPage from '../MainPage';

describe('MainPage component', () => {
    // test('renders the title "Real-time availabilities"', () => {
    //   const a = render(
    //     <MemoryRouter>
    //       <MainPage />
    //   </MemoryRouter>);
    //   console.log(a);
    //   const title = screen.getByText(/real-time availabilities/i);
    //   expect(title).toBeInTheDocument();
    // });
    // test('renders list of service types', () => {
    //   const a = render(
    //     <MemoryRouter>
    //       <MainPage />
    //   </MemoryRouter>);
    //   console.log(a);
    //     const serviceTypes = screen.getAllByRole("servicetype");
    //     expect(serviceTypes.length==5);
    //     expect(serviceTypes[0]=="Hair Cut");
    //     expect(serviceTypes[1]=="Perm");
    //     expect(serviceTypes[2]=="Modeling");
    //     expect(serviceTypes[3]=="Click To Add New Category");
    // });
    it('renders the list of services and their availability', async () => {
      // Mock the API response
      render(
        <MemoryRouter>
          <MainPage />
      </MemoryRouter>);
      const mockCards = [
        {
          id: 1,
          name: 'Hair Cut',
          price: '20',
          info: 'A great haircut',
          weekday: 'Monday',
          hour: '10',
          minute: '00',
          slot: '1',
        }
      ];
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        json: async () => mockCards,
      });
  
      // Render the component and wait for the API call to finish

      await screen.findByText(mockCards[0].name);
  
      // Verify that the cards are displayed correctly
      mockCards.forEach((card) => {
        console.log(card);
        expect(screen.getByText(card.name)).toBeInTheDocument();
        expect(screen.getByText(card.info)).toBeInTheDocument();
        expect(screen.getByText(card.price)).toBeInTheDocument();
        expect(screen.getByText(card.weekday)).toBeInTheDocument();
        expect(screen.getByText(card.hour)).toBeInTheDocument();
        expect(screen.getByText(card.minute)).toBeInTheDocument();
        expect(screen.getByText(card.slot)).toBeInTheDocument();
      });
    });
  });
  
    