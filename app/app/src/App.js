import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";

import { Rank } from "./pages/Rank";
import { Login } from "./pages/Login";

const App = () => {
  return (
    <Router>
      <NotificationContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="" element={<Rank />} />
      </Routes>
    </Router>
  );
};

export default App;
