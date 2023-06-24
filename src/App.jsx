import { Routes, Route } from 'react-router-dom'
import SignIn from './Pages/SignIn/Index';
import './App.css';
import "./variables.css";
import SignUp from './Pages/SignUp/Index';
import Global from './Pages/GlobalPortfolio/Index'
import Portfolio from './Pages/Portfolio';
import DetailPorfolio from './Pages/DetailPortfolio/Index';
import NewTrade from './Pages/NewTrade/Index';
import ExitTrade from './Pages/ExitTrade/Index';
import ReEnter from './Pages/ReEnter/Index';
import Footer from './Components/Footer/Footer';
import Header from './Components/Header/Index';
import Legal from './Pages/Legal/Index';
import Credits from './Pages/Credits/Index';

 

function App() {
  return (
     <>
     <Header/>
     <Routes>
        <Route path= "/" element = {<SignIn />}/> 
        <Route path= "/signUp" element = {<SignUp/>}/>
        <Route path= "/global" element = {<Global/>}/>
        <Route path= "/portfolio/:portfolioId" element = {<Portfolio/>}/>
        <Route path= "/portfolio/detail/:portfolioId" element = {<DetailPorfolio/>}/>
        <Route path= "/newTrade" element = {<NewTrade/>}/>
        <Route path= "/exitTrade/:tradeId" element = {<ExitTrade/>}/>
        <Route path= "/reEnter/:tradeId" element = {<ReEnter/>}/>
        <Route path= "/legal" element = {<Legal/>}/>
        <Route path= "/credits" element = {<Credits/>}/>
     </Routes>
     <Footer/>
     </>
  );
}
export default App;
