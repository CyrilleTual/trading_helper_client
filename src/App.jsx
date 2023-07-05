import { Routes, Route } from "react-router-dom";
import SignIn from "./Pages/SignIn/Index";

import "./variables.css";
import "./App.css";
import SignUp from "./Pages/SignUp/Index";
import Global from "./Pages/GlobalPortfolio/Index";
import Portfolio from "./Pages/Portfolio";
import DetailPorfolio from "./Pages/DetailPortfolio/Index";
import NewTrade from "./Pages/NewTrade/Index";
import ExitTrade from "./Pages/ExitTrade/Index";
import ReEnter from "./Pages/ReEnter/Index";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Index";
import Legal from "./Pages/Legal/Index";
import Credits from "./Pages/Credits/Index";
import Logged from "./helpers/Logged";
import NotFound from "./Pages/NotFound";
import ManagePortfolio from "./Pages/ManagePortfolio/Index";

function App() {
  return (
    <div>
      <div className="page-wrapper">
        <Header />
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/global" element={<Logged child={Global} />} />
          <Route
            path="/portfolio/:portfolioId"
            element={<Logged child={Portfolio} />}
          />
          <Route
            path="/portfolio/detail/:portfolioId"
            element={<Logged child={DetailPorfolio} />}
          />
          <Route
            path="/portfolio/manage"
            element={<Logged child={ManagePortfolio} />}
          />
          <Route path="/newTrade" element={<Logged child={NewTrade} />} />
          <Route
            path="/exitTrade/:tradeId"
            element={<Logged child={ExitTrade} />}
          />
          <Route
            path="/reEnter/:tradeId"
            element={<Logged child={ReEnter} />}
          />
          <Route path="/legal" element={<Legal />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
export default App;
