import BusServerConnector from '../ServerConnector';
import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddService from '../AddService';
import { MemoryRouter } from 'react-router-dom';
import * as router from 'react-router'
// jest.mock('../ServerConnector', () => ({
//   create_service: jest.fn((service_name, service_description, base_price, service_time)=>Promise.resolve({ok: true, text: () => Promise.resolve('Service created successfully')}))
// }));


const navigate = jest.fn()

beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
})

describe('BusServerConnector', () => {

  it('should call the onSubmit function when the form is submitted', async () => {
    // const navigateMock = jest.fn();

    let connector = BusServerConnector.getInstance();
    const mock = jest.spyOn(connector, 'create_service');  // spy on foo
    mock.mockImplementation((service_name, service_description, base_price, service_time)=>true);  // replace implementation
    const mock1 = jest.spyOn(connector, 'refresh_actual_time_slots'); 
    mock1.mockImplementation((week_ahead)=>true);  // replace implementation
    render(
    <MemoryRouter>
    <AddService />
    </MemoryRouter>);

    const serviceInput = screen.getByLabelText('Main Service');
    const dayInput = screen.getByLabelText('Weekday');
    const addTimeButton = screen.getByRole('button', { name: 'Add Time' })
    const priceInput = screen.getByLabelText('Price');
    const infoInput = screen.getByLabelText('Service Information');

    const submitButton = screen.getByRole('button', { name: 'Save Changes' })

    fireEvent.change(serviceInput, { target: { value: 'Test Service' } });
    fireEvent.change(dayInput, { target: { value: 'Monday' } });
    fireEvent.change(priceInput, { target: { value: '10.0' } });
    fireEvent.change(infoInput, { target: { value: 'Test Info' } });
    fireEvent.click(addTimeButton);
    const slotInput = screen.getByTestId('testslot');
    console.log(slotInput)
    fireEvent.change(slotInput, { target: { value: '10' } });


    const timeInputs = screen.getByTestId('testtime');
    fireEvent.change(timeInputs, { target: { value: '09:00' } });


    fireEvent.submit(submitButton);

    await waitFor(() => {
      expect(connector.create_service).toHaveBeenCalledWith('Test Service', 'Test Info', '10.0', [
        { hour: '09', minute: '00', weekday: 'Monday', slots: '10' },
      ]);
      expect(connector.create_service).toHaveBeenCalledTimes(2);
      expect(connector.refresh_actual_time_slots).toHaveBeenCalledWith(2);
      expect(connector.refresh_actual_time_slots).toHaveBeenCalledTimes(2);
      expect(navigate).toHaveBeenCalledWith('../SubmitSuccess');
    });
    mock.mockRestore(); 
  });



})
// describe('BusServerConnector', () => {
//   let connector;

    // beforeAll(() => {
    //   // Create a new BusServerConnector instance and store it in the `connector` variable
    //   connector = new BusServerConnector();
    // });
  
  
    // it('should create a new service', async () => {
    //   // Define the service details
    //   const service_name = 'Test Service';
    //   const service_description = 'This is a test service';
    //   const base_price = 10.0;
    //   const service_time = [      { weekday: 'Monday', hour: '10', minute: '00', slots: '2' },      { weekday: 'Wednesday', hour: '14', minute: '30', slots: '1' },    ];
  
    //   // Call the create_service function
    //   await connector.create_service(service_name, service_description, base_price, service_time);
  
    //   // Assert that the service was created
    //   // You can use any method to check this, such as fetching the list of services and checking that the new service is included in the response
    //   // For example, assuming that the get_services_with_all function returns an array of services and their details:
    //   const services = await connector.get_services_with_all();
    //   const created_service = services.find(service => service.name === service_name);
    //   expect(created_service).toBeDefined();
    //   expect(created_service.description).toBe(service_description);
    //   expect(created_service.best_price).toBe(base_price);
    //   expect(created_service.weekly_time_slots).toHaveLength(service_time.length);
    //   // You can also check the details of each time slot if you want to be more specific
    // });
  
//     it('should handle errors', async () => {
//       // Call the create_service function with invalid arguments or when the API is down and expect it to throw an error or log an error message
//       // For example, assuming that the create_service function throws an error if the service name is empty:
//       const service_name = '';
//       const service_description = 'This is a test service';
//       const base_price = 10.0;
//       const service_time = [      { weekday: 'Monday', hour: '10', minute: '00', slots: '2' },      { weekday: 'Wednesday', hour: '14', minute: '30', slots: '1' },    ];
  
//       await expect(connector.create_service(service_name, service_description, base_price, service_time)).rejects.toThrow();
//     });


//   beforeAll(() => {
//     connector = new BusServerConnector();
//   });

//   describe('get_api_key', () => {
//     it('should retrieve an API key from the server', async () => {
//       await connector.get_api_key();
//       expect(connector.api_key).toBeDefined();
//       expect(typeof connector.api_key).toBe('string');
//     });

//     it('should set api_key to an empty string if the server request fails', async () => {
//       jest.spyOn(global, 'fetch').mockImplementation(() =>
//         Promise.resolve({
//           ok: false,
//         })
//       );

//       await connector.get_api_key();
//       expect(connector.api_key).toBe('');
//       expect(console.log).toHaveBeenCalledWith('error');

//       global.fetch.mockRestore();
//     });

//     describe('get_services_with_all', () => {
//         let connector;
    
//         beforeEach(() => {
//           connector = new BusServerConnector();
//         });
    
//         it('should return a JSON object of services when successfully fetching from the server', async () => {
//           // Mock a successful response from the server
//           global.fetch = jest.fn().mockResolvedValue({
//             ok: true,
//             json: () => ({ mockService: 'Mock Data' }),
//           });
    
//           const result = await connector.get_services_with_all();
//           expect(result).toEqual({ mockService: 'Mock Data' });
    
//           // Assert that the fetch was called with the expected URL
//           expect(fetch).toHaveBeenCalledWith(`${connector.host}api/bus/${connector.api_key}/services`, {
//             method: 'GET',
//             redirect: 'follow',
//           });
//         });
    
//         it('should log an error to the console when failing to fetch from the server', async () => {
//           // Mock a failed response from the server
//           global.fetch = jest.fn().mockResolvedValue({
//             ok: false,
//           });
    
//           console.log = jest.fn();
    
//           await connector.get_services_with_all();
    
//           // Assert that an error was logged to the console
//           expect(console.log).toHaveBeenCalledWith('error');
    
//           // Assert that the fetch was called with the expected URL
//           expect(fetch).toHaveBeenCalledWith(`${connector.host}api/bus/${connector.api_key}/services`, {
//             method: 'GET',
//             redirect: 'follow',
//           });
//         });
//       });
//   });
// });
