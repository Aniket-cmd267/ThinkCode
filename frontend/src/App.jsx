import { Routes, Route, Navigate } from "react-router";
import Homepage from './pages/Homepage'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { authCheck } from './store/authSlice'
import AdminPanel from "./pages/AdminPanel";
import Problem from "./pages/Problem";
import AdminCreate from "./components/AdminCreate";
import AdminDelete from "./components/AdminDelete";
import AdminUpdate from "./components/AdminUpdate";
import UpdateProblem from "./components/UpdateProblem";
import RouteNotExist from "./pages/RouteNotExist";
import Profile from "./components/Profile";
import ProfileNavigation from "./components/ProfileNavigation";
import LandingPage from "./components/landingPage/LandingPage";
import Contest from "./pages/Contest";
import ContestRoom from "./pages/ContestRoom";
import ResumeUpload from './components/Interview/Interview' 

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.slice1)
  useEffect(() => {
    dispatch(authCheck())
  }, []); // empty indicates data will be loaded only once or if a value is present then whenever that data is changed.
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
          </div>
  }
  return (
    <Routes>
      <Route path="/" element={ isAuthenticated ? <Navigate to='/problem' />:<LandingPage/>}></Route>
      <Route path="*" element={isAuthenticated ? <Navigate to='/problem' /> : <RouteNotExist></RouteNotExist>}></Route>
      <Route path="/signup" element={!(isAuthenticated) ? <Signup /> : <Navigate to='/problem' />}></Route>
      <Route path="/login" element={!(isAuthenticated) ? <Login /> : <Navigate to='/problem' />}></Route>
      <Route path="/profile" element={!isAuthenticated ? <Navigate to='/login'/> : <Profile></Profile>}></Route>
      <Route path="/" element={<ProfileNavigation></ProfileNavigation>}>
        <Route path="/problem" element={(isAuthenticated) ? <Homepage /> : <Navigate to='/signup'></Navigate>}></Route>
        <Route path="/admin"
          element={(isAuthenticated) && user?.role === 'admin' ? <AdminPanel /> : <Navigate to='/problem' />}
        ></Route>
        <Route path="/admin/create"
          element={(isAuthenticated) && user?.role === 'admin' ? <AdminCreate /> : <Navigate to='/problem' />}></Route>
        <Route path="/admin/update"
          element={(isAuthenticated) && user?.role === 'admin' ? <AdminUpdate /> : <Navigate to='/problem' />}></Route>
        <Route path="/admin/update/:id"
          element={(isAuthenticated) && user?.role === 'admin' ? <UpdateProblem /> : <Navigate to='/problem' />}></Route>
        <Route path="/admin/delete"
          element={(isAuthenticated && user?.role === 'admin') ? <AdminDelete /> : <Navigate to='/problem' />}></Route>

        <Route path="/contest" element={isAuthenticated ? <Contest /> : <Navigate to='/login' />}></Route>
        <Route path="/contest/:roomId" element={isAuthenticated ? <ContestRoom /> : <Navigate to='/login' />}></Route>
        <Route path="/problem/:problemId" element={<Problem></Problem>}></Route>


        <Route path="/interview" element={isAuthenticated ? <ResumeUpload/> : <Navigate to='/login'/>}></Route>
      </Route>

    </Routes>

    // {/* <Route path="/admin" element={(isAuthenticated) ? <AdminPanel/> : <Navigate to='/signup'></Navigate>}></Route>  */}
    //   {/* isse user nhii huaa tb bhi /admin pe chale jaayega pr woh kush submit nhii kr paayega kyuki adminMiddleware backend mein allowed nhii kregaa. */}
    /* <Route path="/admin" element={<AdminPanel/> }></Route>  */
  )
}
export default App;
