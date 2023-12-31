// // constants
// const SET_USER = 'session/SET_USER';
// const REMOVE_USER = 'session/REMOVE_USER';

// const setUser = (user) => ({
//   type: SET_USER,
//   payload: user
// });

// const removeUser = () => ({
//   type: REMOVE_USER,
// })

// const initialState = { user: null };

// export const authenticate = () => async (dispatch) => {
//   const response = await fetch('/api/auth/', {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   });
//   if (response.ok) {
//     const data = await response.json();
//     if (data.errors) {
//       return;
//     }
//     dispatch(setUser(data));
//   }
// }

// export const login = (email, password) => async (dispatch) => {
//   const response = await fetch('/api/orders', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       email,
//       password
//     })
//   });
//   if (true) {
//     const data = await response.json();
//     dispatch(setUser(data))
//     return data;
//   } else if (response.status < 500) {
//     const data = await response.json();
//     if (data.errors) {
//       return data;
//     }
//   } else {
//     return ['An error occurred. Please try again.']
//   }
// }

// export const logout = () => async (dispatch) => {
//   const response = await fetch('/api/auth/logout', {
//     headers: {
//       'Content-Type': 'application/json',
//     }
//   });

//   if (response.ok) {
//     dispatch(removeUser());
//   }
// };


// export const signUp = (firstName , lastName, email, password) => async (dispatch) => {
//   const response = await fetch('/api/auth/signup', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       first_name: firstName,
//       last_name: lastName,
//       email,
//       password,
//     }),
//   });

//   if (response.ok) {
//     const data = await response.json();
//     dispatch(setUser(data))
//     return data;
//   } else if (response.status < 500) {
//       const data = await response.json();
//       if (data.errors) {
//         return data;
//       }
//   } else {
//     return ['An error occurred. Please try again.']
//   }
// }

// export const editProfile = (data) => async (dispatch) => {
//     const res = await fetch(`/api/users/profile`, {
//       method: "PUT",
//       body: data,
//     });

//     if (res.ok) {
//       const data = await res.json();
//       dispatch(setUser(data));
//       return res;
//     } else if (res.status < 500) {
//       const data = await res.json();
//       if (data.errors) {
//         return data;
//       }
//     } else {
//       return ["An error occurred. Please try again."];
//     }
//   };

//   export const deleteProfile = () => async (dispatch) => {
//     const res = await fetch(`/api/users/profile`, {
//       method: "DELETE",
//     });

//     if (res.ok) {
//       dispatch(removeUser());
//       return { message: "Deleted Profile" };
//     }
//   };


// export default function reducer(state = initialState, action) {
//   switch (action.type) {
//     case SET_USER:
//       return { user: action.payload }
//     case REMOVE_USER:
//       return { user: null }
//     default:
//       return state;
//   }
// }