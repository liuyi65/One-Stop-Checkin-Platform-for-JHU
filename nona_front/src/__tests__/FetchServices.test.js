import { renderHook, act } from "@testing-library/react-hooks";
import fetchMock from 'jest-fetch-mock';
import useFetchServices from '../server/FetchServices';
import BusServerConnector from '../ServerConnector';
// Enable fetchMock
fetchMock.enableMocks();
// Mock the BusServerConnector module
jest.mock('../ServerConnector', () => ({
  getInstance: jest.fn(() => ({
    get_services_with_all: jest.fn(),
  })),
}));

describe('useFetchServices', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should fetch services and return them', async () => {
    // Mock the API response
    const mockServices = [
      {
        name: 'Service 1',
        service_id: 1,
        description: 'Service 1 description',
        price: 10,
        available_slots: [10, 12, 14],
      },
      {
        name: 'Service 2',
        service_id: 2,
        description: 'Service 2 description',
        price: 20,
        available_slots: [11, 13, 15],
      },
    ];
    fetch.mockResponseOnce(JSON.stringify(mockServices));

    const { result, waitForNextUpdate } = renderHook(() => useFetchServices());

    // Check that services are initially empty
    expect(result.current).toEqual([]);

    // Wait for the hook to update with the fetched services
    await waitForNextUpdate({ timeout: 5000 });

    // Check that services have been fetched and set correctly
    expect(result.current).toEqual(mockServices);

    // Check that the API was called with the correct parameters
    expect(fetch).toHaveBeenCalledWith(
        `http://api.magicspica.com/api/businesses/22b5e6d04f1a17772f4413b92d7e14bd654bdf41dc82de1cdb8ac81011881bb5/services`
    );
  });

  it('should handle errors when fetching services', async () => {
    // Mock the API call to throw an error
    BusServerConnector.getInstance().get_services_with_all.mockRejectedValue(new Error('API error'));

    const { result, waitForNextUpdate } = renderHook(() => useFetchServices());

    // Check that services are initially empty
    expect(result.current).toEqual([]);

    // Wait for the hook to update with the fetched services (which will be empty due to the error)
    await waitForNextUpdate();

    // Check that services have been set to an empty array due to the error
    expect(result.current).toEqual([]);

    // Check that the API was called with the correct parameters
    expect(BusServerConnector.getInstance().get_services_with_all).toHaveBeenCalledTimes(1);
  });
});