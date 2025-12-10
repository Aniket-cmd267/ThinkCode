import { Routes, Route } from "react-router";
import Homepage from './pages/Homepage'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { Provider } from "react-redux";
import {stores} from './store/Store'

function App(){
  return(
    <Provider store={stores}>
      <Routes>
        <Route path="/" element= {<Homepage/>}></Route>
        <Route path="/signup" element= {<Signup/>}></Route>
        <Route path="/login" element= {<Login/>}></Route>
      </Routes>
    </Provider>
  )
}
export default App;
