import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { useAppSelector, useAppDispatch } from "./appState/hooks.js";
import components from "./components/index";
import pages from "./pages/index";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <components.Layout /> } >
          <Route path="/listings" index element={<pages.Listings />} />
          <Route path="/login" element={ <pages.Login /> } />
          <Route path="/signup" element={<pages.Signup />} />
          <Route path="/home" element={<pages.Home />} />
          <Route path="/about" element={<pages.About />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
