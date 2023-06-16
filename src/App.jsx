import { Routes, Route } from 'react-router-dom'
import SignIn from './Pages/SignIn/Index';
import './App.css';
import SignUp from './Pages/SignUp/Index';

function App() {
  return (
     <>
     <Routes>
        <Route path= "/" element = {<SignIn />}/> 
        <Route path= "/signUp" element = {<SignUp/>}/>
     </Routes>
     </>
  );
}
export default App;
