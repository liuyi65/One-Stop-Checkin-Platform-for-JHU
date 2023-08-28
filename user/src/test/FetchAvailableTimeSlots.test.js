import { renderHook, act } from "@testing-library/react-hooks";
import useFetchAvailableTimeSlots from "../components/server/FetchAvailableTimeSlots";
import fetchMock from "jest-fetch-mock";

// Enable fetchMock
fetchMock.enableMocks();

describe("useFetchAvailableTimeSlots", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it("fetches available time slots based on service_id", async () => {
        // Mock the API response with sample data
        const sampleTimeSlots = [
            { name: 'Service 1', type: 'Type 1', price: '$10' },
            { name: 'Service 2', type: 'Type 2', price: '$15' },
            { name: 'Service 3', type: 'Type 3', price: '$20' },
            { name: 'Service 4', type: 'Type 3', price: '$20' },
            { name: 'Service 5', type: 'Type 3', price: '$20' },
            { name: 'Service 5', type: 'Type 3', price: '$20' },
            { name: 'Service 5', type: 'Type 3', price: '$20' },
            { name: 'Service 5', type: 'Type 3', price: '$20' },
            { name: 'Service 5', type: 'Type 3', price: '$20' },
        ];
        fetch.mockResponseOnce(JSON.stringify(sampleTimeSlots));

        const service_id = 1;
        const { result, waitForNextUpdate } = renderHook(() =>
            useFetchAvailableTimeSlots(service_id)
        );

        // Assert that the initial state is an empty array
        expect(result.current).toEqual([]);

        // Wait for the hook to fetch data
        await act(async () => {
            await waitForNextUpdate();
        });

        // Assert that the data has been fetched and the state has been updated
        expect(result.current).toEqual(sampleTimeSlots);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            `http://api.magicspica.com/api/services/${service_id}/available_time_slots`
        );
    });

    it("handles fetch errors", async () => {
        // Mock a fetch error
        fetch.mockReject(() =>
            Promise.reject(new Error("Error fetching data from API"))
        );

        const service_id = 1;
        const { result, waitForNextUpdate } = renderHook(() =>
            useFetchAvailableTimeSlots(service_id)
        );

        // Assert that the initial state is an empty array
        expect(result.current).toEqual([]);

        // Wait for the hook to fetch data
        await act(async () => {
            await waitForNextUpdate();
        });

        // Assert that the state remains empty on error
        expect(result.current).toEqual([]);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            `http://api.magicspica.com/api/services/${service_id}/available_time_slots`
        );
    });
});
