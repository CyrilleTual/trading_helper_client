import { Routes, Route } from 'react-router-dom'
import SignIn from './Pages/SignIn/Index';
import './App.css';
import SignUp from './Pages/SignUp/Index';
import Global from './Pages/GlobalPortfolio/Index'
import NavPorfolios from './Components/NavPortfolios';
import Portfolio from './Pages/Portfolio';
import DetailPorfolio from './Pages/DetailPortfolio/Index';
import Nav from './Components/Nav';
import NewTrade from './Pages/NewTrade/Index';
import ExitTrade from './Pages/ExitTrade/Index';
 

function App() {
  return (
     <>
     < Nav/>
     < NavPorfolios />
     <Routes>
        <Route path= "/" element = {<SignIn />}/> 
        <Route path= "/signUp" element = {<SignUp/>}/>
        <Route path= "/global" element = {<Global/>}/>
        <Route path= "/portfolio/:portfolioId" element = {<Portfolio/>}/>
        <Route path= "/portfolio/detail/:portfolioId" element = {<DetailPorfolio/>}/>
        <Route path= "/newTrade" element = {<NewTrade/>}/>
        <Route path= "/exitTrade/:tradeId" element = {<ExitTrade/>}/>
     </Routes>
     </>
  );
}
export default App;
