import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
// import { Modal } from '../../context/Modal';
// import SignupModal from './SignupModal';
// import SigninModal from './SigninModal';
// import DropDown from './DropDown';

const NavBar = ({dropDown, setDropDown}) => {
  //
  // const user = useSelector((state)=> state.session.user)
  // const [signupModal, setSignupModal] = useState(false)
  // const [signinModal, setSigninModal] = useState(false)
  //
  // const toggleSignupModal = () =>{
  //   setSignupModal((state) => !state)
  // }
  //
  // const toggleSigninModal = () =>{
  //   setSigninModal((state) => !state)
  // }

  return (
    <>
      <div className='flex w-full max-w-screen-2xl items-center mt-6 h-14
       bg-white m-auto border border-b'
       onClick={()=> setDropDown(false)}
      >

        <NavLink
        className='flex mr-auto pl-8 items-center space-x-2'
        to='/'
        exact={true}
        activeClassName='active'>
          <img className=' w-12 h-9'
          src='https://lirp.cdn-website.com/0e047572/dms3rep/multi/opt/nona.media-with-icon-trans-square-full-white-text-1920w.png'/>
          <p className='font-extrabold text-xl font-sans'
          >Nano</p>
        </NavLink>
        {/*{*/}
        {/*  !user && (*/}
        {/*    <div className='pr-10 space-x-3'>*/}
        {/*      <button*/}
        {/*        className='bg-signup_blue text-white text-xs w-20 h-8 border border-signup_blue rounded-sm'*/}
        {/*        onClick={toggleSignupModal}*/}
        {/*        >Sign up*/}
        {/*      </button>*/}
        {/*      <button*/}
        {/*        className='text-xs w-20 h-8 border border-gray-300 rounded-sm'*/}
        {/*        onClick={toggleSigninModal}*/}
        {/*        >Sign in*/}
        {/*      </button>*/}
        {/*    </div>*/}
        {/*  )*/}
        {/*}*/}
        {/*/!* </div> *!/*/}
        {/*{user && (*/}
        {/*  <div className='pr-10 flex space-x-2 relative'>*/}

        {/*    {*/}
        {/*      user.profile_picture && (*/}
        {/*        <img*/}
        {/*        className='w-10 h-10 border rounded-full'*/}
        {/*        src={user?.profile_picture}*/}
        {/*        onClick={(e) =>{*/}
        {/*          e.stopPropagation()*/}
        {/*          setDropDown((state) => !state)*/}
        {/*        }}*/}
        {/*         />*/}

        {/*      )*/}
        {/*    }*/}
        {/*    <div className='absolute left-auto right-[330px] z-10'>*/}
        {/*      {dropDown && (*/}
        {/*          <DropDown user={user} setDropDown={setDropDown} />*/}
        {/*        )*/}
        {/*      }*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
      {/*{signupModal && (*/}
      {/*  <Modal*/}
      {/*  className="w-64 h-96 bg-white"*/}
      {/*  onClose={toggleSignupModal}>*/}
      {/*    <SignupModal*/}
      {/*      onClose={toggleSignupModal}*/}
      {/*    />*/}
      {/*  </Modal>*/}
      {/*)}*/}

      {/*{signinModal && (*/}
      {/*  <Modal*/}
      {/*  className="w-64 h-96 bg-white"*/}
      {/*  onClose={toggleSigninModal}>*/}
      {/*    <SigninModal*/}
      {/*      onClose={toggleSigninModal}*/}
      {/*    />*/}
      {/*  </Modal>*/}
      {/*)}*/}
    </>
  );
}

export default NavBar;
