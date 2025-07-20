//import { useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Components from "./components/index";
import Pages from "./pages/index.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Components.Layout />}>
          <Route index element={<Pages.Listings />} />
          <Route path="/listings" element={<Pages.Listings />} />
          <Route path="/login" element={<Pages.Login />} />
          <Route path="/logout" element={<Pages.Logout />} />
          <Route path="/signup" element={<Pages.Signup />} />
          <Route path="/home" element={<Pages.Home />} />
          <Route path="/about" element={<Pages.About />} />
          <Route path="/me" element={<Pages.UserAccount />} />
          <Route path="/test" element={<Components.TestComponent />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
