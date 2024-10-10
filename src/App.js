import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from './pages/Dashboard';
import FacebookAdsConfig from './pages/FacebookAdsConfig';
import UserRegisterForm from './pages/UserRegisterForm';
import UserLoginForm from './pages/UserLoginForm';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS


function App() {
  return (
    <GoogleOAuthProvider clientId="329761739398-6dmgqoson3q56k3s5e26ki0oa5mmutj1.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-fb-ads-config" element={<FacebookAdsConfig />} />
          </Route>
          <Route path="/register" element={<UserRegisterForm />} />
          <Route path="/login" element={<UserLoginForm />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
