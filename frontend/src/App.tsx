import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import pages from "./pages/index";

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(
    window.localStorage.getItem("accessToken") || null,
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  window.localStorage.getItem("accessToken");
  return (
    <Router>
      <Routes>
        <Route path="/listings" element={<pages.Listings />} />
        <Route
          path="/login"
          element={
            <pages.Login
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              accessToken={accessToken}
              setAccessToken={setAccessToken}
            />
          }
        />
        <Route path="/" element={<pages.Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
