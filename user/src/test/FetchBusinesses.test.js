import { renderHook, act } from "@testing-library/react-hooks";
import useFetchBusinesses from "../components/server/FetchBusinesses";
import fetchMock from "jest-fetch-mock";


// Enable fetchMock
fetchMock.enableMocks();

describe("useFetchBusinesses", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it("fetches businesses based on service_id", async () => {
        const sampleBusinesses = {name:"KFC", rate: 2.0, preview_image:"https://1000logos.net/wp-content/uploads/2017/03/Kfc_logo.png",
            num_of_reviews: 4, type: "fast food",city: "baltimore", phone_number: "(586) 791-6070", id: 0, description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore " +
                "magna aliqua. Proin fermentum leo vel orci porta non pulvinar neque laoreet. At elementum eu facilisis sed " +
                "odio morbi. Ut sem nulla pharetra diam sit amet. Eu tincidunt tortor aliquam nulla facilisi cras fermentum. " +
                "Vitae auctor eu augue ut lectus arcu bibendum at. Sed risus ultricies tristique nulla. Ut faucibus pulvinar " +
                "elementum integer enim neque. Quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis. Ut " +
                "placerat orci nulla pellentesque dignissim enim sit amet venenatis.\n" +
                "\n" }
        fetch.mockResponseOnce(JSON.stringify(sampleBusinesses));

        const service_id = 1;
        const { result, waitForNextUpdate } = renderHook(() =>
            useFetchBusinesses(service_id)
        );

        // Assert that the initial state is an empty array
        expect(result.current).toEqual([]);

        // Wait for the hook to fetch data
        await act(async () => {
            await waitForNextUpdate();
        });

        // Assert that the data has been fetched and the state has been updated
        expect(result.current).toEqual(sampleBusinesses);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            `http://api.magicspica.com/api/businesses/${service_id}/services`
        );
    });

    it("handles fetch errors", async () => {
        // Mock a fetch error
        fetch.mockReject(() =>
            Promise.reject(new Error("Error fetching data from API"))
        );

        const service_id = 1;
        const { result, waitForNextUpdate } = renderHook(() =>
            useFetchBusinesses(service_id)
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
            `http://api.magicspica.com/api/businesses/${service_id}/services`
        );
    });
});
