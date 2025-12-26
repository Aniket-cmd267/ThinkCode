import { Routes, Route,Navigate } from "react-router";
import Homepage from './pages/Homepage'
import Signup from './pages/Signup'
import Login from './pages/Login'
import {useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { authCheck } from './store/authSlice'
import AdminPanel from "./pages/AdminPanel";
import Problem from "./pages/Problem";
import AdminCreate from "./components/AdminCreate";
import AdminDelete from "./components/AdminDelete";
import AdminUpdate from "./components/AdminUpdate";

function App(){

    const dispatch= useDispatch();
    const {isAuthenticated,user,loading} = useSelector((state) => state.slice1)
    useEffect(() =>{
      dispatch(authCheck())
    },[]) ; // empty indicates data will be loaded only once or if a value is present then whenever that data is changed.
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>;
    }
    return(
        <Routes>
          <Route path="/" element= {(isAuthenticated) ? <Homepage/> : <Navigate to='/signup'></Navigate>}></Route>
          <Route path="/signup" element= {!(isAuthenticated)? <Signup/> : <Navigate to='/'/>}></Route>
          <Route path="/login" element= {!(isAuthenticated)? <Login/> : <Navigate to='/'/>}></Route>
          <Route path="/admin" element={<AdminPanel/> }></Route> 
          <Route path="/admin/create" element={<AdminCreate/>}></Route> 
          <Route path="/admin/update" element={<AdminUpdate/>}></Route>
          <Route path="/admin/delete" element={(isAuthenticated && user?.role ==='admin') ? <AdminDelete/> : <Login/>}></Route>

          {/* <Route path="/admin"
            element={(isAuthenticated) && user?.role ==='admin' ? <AdminPanel/> : <Navigate to='/'/>}
          ></Route> */}
          <Route path="/problem/:problemId" element={<Problem></Problem>}></Route>
        </Routes>

        // {/* <Route path="/admin" element={(isAuthenticated) ? <AdminPanel/> : <Navigate to='/signup'></Navigate>}></Route>  */}
        //   {/* isse user nhii huaa tb bhi /admin pe chale jaayega pr woh kush submit nhii kr paayega kyuki adminMiddleware backend mein allowed nhii kregaa. */}
    )
}
export default App;
