import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import "./variables.css";
import "./App.css";

import Adjust from "./Pages/Adjust/Index";
import Credits from "./Pages/Credits/Index";
import DetailPorfolio from "./Pages/DetailPortfolio/Index";
import ErrorServer from "./Pages/ErrorServer/Index";
import ExitTrade from "./Pages/ExitTrade/Index";
import Footer from "./Components/Footer/Footer";
import Global from "./Pages/GlobalPortfolio/Index";
import Header from "./Components/Header/Index";
import Legal from "./Pages/Legal/Index";
import Logged from "./helpers/Logged";
import ManagePortfolio from "./Pages/ManagePortfolio/Index";
import NewTrade from "./Pages/NewTrade/Index";
import NotFound from "./Pages/NotFound";
import Portfolio from "./Pages/Portfolio";
import ReEnter from "./Pages/ReEnter/Index";
import SignIn from "./Pages/SignIn/Index";
import SignUp from "./Pages/SignUp/Index";
import Strategies from "./Pages/Strategies/Index";
import DetailTrade from "./Pages/DetailTrade/Index";
 
//import TickerTape from "./Components/Extras/TickerTape";
const TickerTape = lazy(() => import("./Components/Extras/TickerTape"));


function App() {



  return (
    <div>
      <div className="page-wrapper">
        <Suspense fallback={<p>Loading</p>}>
          <TickerTape />
        </Suspense>
        <Header />
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/errorServer" element={<ErrorServer />} />
          <Route path="/global" element={<Logged child={Global} />} />
          <Route
            path="/portfolio/:portfolioId"
            element={<Logged child={Portfolio} />}
          />
          <Route
            path="/portfolio/:portfolioId/detail"
            element={<Logged child={DetailPorfolio} />}
          />
          <Route
            path="/portfolio/manage"
            element={<Logged child={ManagePortfolio} />}
          />
          <Route path="/newTrade" element={<Logged child={NewTrade} />} />
          <Route
            path="/portfolio/:portfolioId/exitTrade/:tradeId"
            element={<Logged child={ExitTrade} />}
          />
          <Route
            path="/reEnter/portfolio/:portfolioId/stock/:tradeId"
            element={<Logged child={ReEnter} />}
          />
          <Route
            path="/portfolio/:portfolioId/ajust/:tradeId"
            element={<Logged child={Adjust} />}
          />
          <Route
            path="/portfolio/:portfolioId/detail/:tradeId"
            element={<Logged child={DetailTrade} />}
          />
 
          <Route path="/strategies" element={<Logged child={Strategies} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
export default App;
