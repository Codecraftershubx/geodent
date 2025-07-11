//import { useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//import { useAppSelector, useAppDispatch } from "./appState/hooks.js";
//import { loginUser } from "./appState/slices/authSlice.js";
//import { clearAppMessage } from "./appState/slices/appMessageSlice.js";
//import type { RootState } from "./utils/types.js";
import Components from "./components/index";
import Pages from "./pages/index.js";

function App() {
  // if access token, try logging use back in
  //const { accessToken, isLoggedIn } = useAppSelector(
  //  (store: RootState) => store.auth
  //);
  //const dispatch = useAppDispatch();
  //const firstMount = useRef(true);
  //const autoLogin = async () => {
  //  try {
  //    dispatch(clearAppMessage());
  //    const result = await dispatch(loginUser({ accessToken })).unwrap();
  //    if (result.redirect) {
  //      window.location.href = result.redirect;
  //    }
  //  } catch (error: any) {
  //    console.error(error);
  //    if (error?.header?.message === "Error: already loggedd in") {
  //      dispatch(clearAppMessage());
  //    }
  //  }
  //};

  //useEffect(() => {
  //  if (message && accessToken) {
  //    if (message.type === "error") {
  //      const description = "Your session has expired. Login again.";
  //      dispatch(setAppMessage({ ...message, description }));
  //      dispatch(toggleAppMessage({ autoHide: false }));
  //    }
  //  }
  //}, [message, accessToken]);

  //useEffect(() => {
  //  if (firstMount.current) {
  //    console.log("APP INITIAL MOUNT...");
  //    firstMount.current = false;
  //    if (accessToken && isLoggedIn) {
  //      console.log("APP LOGGING IN...");
  //      autoLogin();
  //    }
  //  }
  //}, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Components.Layout />}>
          <Route index element={<Pages.Listings />} />
          <Route path="/listings" element={<Pages.Listings />} />
          <Route path="/login" element={<Pages.Login />} />
          <Route path="/signup" element={<Pages.Signup />} />
          <Route path="/home" element={<Pages.Home />} />
          <Route path="/about" element={<Pages.About />} />
          <Route path="/users/me" element={<Pages.UserAccount />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
