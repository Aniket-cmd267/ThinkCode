import { Routes, Route,Navigate } from "react-router";
import Homepage from './pages/Homepage'
import Signup from './pages/Signup'
import Login from './pages/Login'
import {useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { authCheck } from './store/authSlice'

function App(){

  const dispatch= useDispatch();
  const {isAuthenticated} = useSelector((state) => state.slice1)
  useEffect(() =>{
    dispatch(authCheck())
  },[]) ; // empty indicates data will be loaded only once or if a value is present then whenever that data is changed.

  return(
      <Routes>
        <Route path="/" element= {(isAuthenticated) ? <Homepage/> : <Navigate to='/signup'></Navigate>}></Route>
        <Route path="/signup" element= {!(isAuthenticated)? <Signup/> : <Navigate to='/'/>}></Route>
        <Route path="/login" element= {!(isAuthenticated)? <Login/> : <Navigate to='/'/>}></Route>
      </Routes>
  )
}
export default App;
