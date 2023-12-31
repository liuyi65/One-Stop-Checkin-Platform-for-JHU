const LOAD_ALL_RESTAURANTS = "restaurants/LOAD_ALL_RESTAURANTS";
const LOAD_RESTAURANT_DETAILS = "restaurants/LOAD_RESTAURANT_DETAILS"


const loadAllRestaurant = (restaurants) => ({
    type: LOAD_ALL_RESTAURANTS,
    restaurants
})

const loadRestDetails = (restaurant) => ({
    type: LOAD_RESTAURANT_DETAILS,
    restaurant
})

export const getAllRestaurants = () => async (dispatch) =>{

    const response = await fetch('/api/businesses');
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    // let request = await fetch("http://127.0.0.1:5000/api/businesses", requestOptions)
    //     .then(response => response.text())
    //     .then(result => console.log(result))
    //     .catch(error => console.log('error', error));

    const data = await response.json();

    const payload = {};

    for (let obj of data.Restaurants) {
    payload[obj.id] = obj;
    }

    dispatch(loadAllRestaurant(payload));
    return data;
}


export const getRestDetails = (restId) => async (dispatch) => {
    const response = await fetch(`/api/restaurants/${restId}`);
    const data = await response.json();

    if (response.ok) {
      dispatch(loadRestDetails(data));
      return data;
    }
};


const restaurantsReducer = (state = {}, action) => {
    switch(action.type){
        case LOAD_ALL_RESTAURANTS:
            return { ...action.restaurants }
        case LOAD_RESTAURANT_DETAILS:
            return {
                ...state,
                [action.restaurant.id]: { ...state[action.restaurant.id], ...action.restaurant },
            }
        default:
            return state;
    }
}

export default restaurantsReducer;