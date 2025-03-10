import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import pages from "./pages/index";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<pages.Login />} />
        <Route path="/" element={<pages.Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
