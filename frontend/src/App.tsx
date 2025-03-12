import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import components from "./components/index";
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
        <Route
          path="/"
          element={
            <components.Layout
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        >
          <Route index element={<pages.Listings />} />
          <Route path="/listings" index element={<pages.Listings />} />
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
          <Route path="/signup" element={<pages.Signup />} />
          <Route path="/home" element={<pages.Home />} />
          <Route path="/about" element={<pages.About />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
