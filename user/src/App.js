import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate} from "react-router-dom"
import { useDispatch } from 'react-redux';
import NavBar from './components/NavBar/NavBar';
import About from './components/NavBar/About';
import { authenticate } from './store/session';
import { HomePage } from './components/HomePage';
//import Profile from './components/UserProfile/Profile';
import RestaurantPage from './components/RestaurantPage/RestaurantPage';
import UserReservations from './components/UserReservations/UserReservations';
import NearestRestos from './components/NearestRestosPage/NearestRestosPage';
import CategoryPage from "./components/HomePage/CategoryPage";
import Login from "./components/auth/Login"
import Signup from "./components/auth/Signup"
import ForgotPassword from "./components/auth/ForgotPassword"

import { AuthProvider } from "./context/AuthContext"
function App() {
  const [loaded, setLoaded] = useState(false);
  const [dropDown, setDropDown] = useState(false)
  const dispatch = useDispatch();

  // useEffect(() => {
  //   (async() => {
  //     await dispatch(authenticate());
  //     setLoaded(true);
  //   })();
  // }, [dispatch]);
  //
  // if (!loaded) {
  //   return null;
  // }

  return (
    <div>
      {/* <NavBar dropDown={dropDown} setDropDown={setDropDown} /> */}
      
      <Router>
      <AuthProvider>
        <Routes>
          <Route path='/nearest' element = {<NearestRestos />}/>
          <Route path='/about' element = {<About />}/>
          <Route path='/categories' element = {<CategoryPage />}/>
          <Route path='/users/reservations' element = {<UserReservations />}/>
          {/* <Route path='/users/:userId' element = {<Profile />}/> */}
          <Route path='/restaurants/:restaurantId' element = {<RestaurantPage />}/>
          <Route path='/homepage' element = {<HomePage />}/>
          <Route exact path='/' element = {<Login />}/>
          <Route path='/signup' element = {<Signup />}/>
          <Route path="/forgot-password" element={<ForgotPassword />}/>
        </Routes>
        
      </AuthProvider>
      </Router>
    </div>
    // <BrowserRouter>
    //       <NavBar dropDown={dropDown} setDropDown={setDropDown} />
    //   <div onClick={()=> setDropDown(false)}>
    //       <Switch>
    //         <Route path='/nearest' exact={true}>
    //           <NearestRestos />
    //         </Route>
    //         <Route path='/about' exact={true}>
    //           <About />
    //         </Route>
    //         <Route path='/categories' exact={true}>
    //           <CategoryPage />
    //         </Route>
    //         <Route path='/users/reservations' exact={true} >
    //           <UserReservations />
    //         </Route>
    //         <Route path='/users/:userId' exact={true} >
    //           <Profile />
    //         </Route>
    //         <Route path='/restaurants/:restaurantId' exact={true}>
    //           <RestaurantPage />
    //         </Route>
    //         <Route path='/' exact={true} >
    //           <Login />
    //         </Route>
    //       </Switch>
    //     </div>

    // </BrowserRouter>
  );
}

export default App;
