import { Routes, Route } from "react-router";
import Homepage from './pages/Homepage'
import Signup from './pages/Signup'
import Login from './pages/Login'
function App(){
  return(
    <>
      <Routes>
        <Route path="/" element= {<Homepage/>}></Route>
        <Route path="/signup" element= {<Signup/>}></Route>
        <Route path="/login" element= {<Login/>}></Route>
      </Routes>
    </>
  )
}
export default App;
