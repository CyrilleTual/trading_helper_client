import { Routes, Route } from 'react-router-dom'
import SignIn from './Pages/SignIn/Index';
import './App.css';
import SignUp from './Pages/SignUp/Index';
import Global from './Pages/GlobalPortfolio/Index'
import NavPorfolios from './Components/NavPortfolios';
import Portfolio from './Pages/Portfolio';

function App() {
  return (
     <>
     < NavPorfolios />
     <Routes>
        <Route path= "/" element = {<SignIn />}/> 
        <Route path= "/signUp" element = {<SignUp/>}/>
        <Route path= "/global" element = {<Global/>}/>
        <Route path= "/portfolio/:portfolioId" element = {<Portfolio/>}/>
     </Routes>
     </>
  );
}
export default App;
