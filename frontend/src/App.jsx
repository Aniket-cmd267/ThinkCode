import { Routes, Route,Navigate } from "react-router";
import Homepage from './pages/Homepage'
import Signup from './pages/Signup'
import Login from './pages/Login'
import {useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { authCheck } from './store/authSlice'
import AdminPanel from "./pages/AdminPanel";

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
        <Route path="/admin" element={<AdminPanel/> }></Route> 
        {/* <Route path="/admin" element={(isAuthenticated) ? <AdminPanel/> : <Navigate to='/signup'></Navigate>}></Route>  */}
        {/* isse user nhii huaa tb bhi /admin pe chale jaayega pr woh kush submit nhii kr paayega kyuki adminMiddleware backend mein allowed nhii kregaa. */}

        {/* <Route path="/admin"
          element={(isAuthenticated) && user?.role ==='admin' ? <AdminPanel/> : <Navigate to='/'/>}
        ></Route> */}
      </Routes>
  )
}
export default App;
