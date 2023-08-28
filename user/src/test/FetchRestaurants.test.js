import { renderHook, act } from "@testing-library/react-hooks";
import useFetchRestaurants from "../components/server/FetchRestaurants";
import fetchMock from "jest-fetch-mock";

// Enable fetchMock
fetchMock.enableMocks();

describe("useFetchRestaurants", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it("fetches restaurants", async () => {
        const sampleRestaurants =[{name:"KFC", rate: 2.0, preview_image:"https://1000logos.net/wp-content/uploads/2017/03/Kfc_logo.png",
            num_of_reviews: 4, type: "fast food",city: "baltimore", phone_number: "(586) 791-6070", id: 0 },
            {name:"KFC2", rate: 2.0, preview_image:"https://1000logos.net/wp-content/uploads/2017/03/Kfc_logo.png",
                num_of_reviews: 4, type: "fast food",city: "baltimore", phone_number: "(586) 791-6070",id: 1 },
            {name:"fsdfsd", rate: 2.0, preview_image:"https://1000logos.net/wp-content/uploads/2017/03/Kfc_logo.png",
                num_of_reviews: 4, type: "fast food",city: "baltimore", phone_number: "(586) 791-6070",id: 2 },
            {name:"KFC3", rate: 2.0, preview_image:"https://1000logos.net/wp-content/uploads/2017/03/Kfc_logo.png",
                num_of_reviews: 4, type: "fast food",city: "baltimore", phone_number: "(586) 791-6070",id: 3 },]
        fetch.mockResponseOnce(JSON.stringify(sampleRestaurants));

        const { result, waitForNextUpdate } = renderHook(() => useFetchRestaurants());

        // Assert that the initial state is an empty array
        expect(result.current).toEqual([]);

        // Wait for the hook to fetch data
        await act(async () => {
            await waitForNextUpdate();
        });

        // Assert that the data has been fetched and the state has been updated
        expect(result.current).toEqual(sampleRestaurants);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith("http://api.magicspica.com/api/businesses");
    });

    it("handles fetch errors", async () => {
        // Mock a fetch error
        fetch.mockReject(() =>
            Promise.reject(new Error("Error fetching data from API"))
        );

        const { result, waitForNextUpdate } = renderHook(() => useFetchRestaurants());

        // Assert that the initial state is an empty array
        expect(result.current).toEqual([]);

        // Wait for the hook to fetch data
        await act(async () => {
            await waitForNextUpdate();
        });

        // Assert that the state remains empty on error
        expect(result.current).toEqual([]);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith("http://api.magicspica.com/api/businesses");
    });
});
