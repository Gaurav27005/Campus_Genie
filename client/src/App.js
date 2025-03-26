import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LostAndFound from './pages/LostAndFound';
import FindItems from './pages/FindItems';
import PostItem from './pages/PostItem';
import Map from './pages/Map';
import Materials from './pages/Materials';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Marketplace from './pages/Marketplace';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lostandfound" element={<LostAndFound />} />
        <Route path="/find-items" element={<FindItems />} />
        <Route path="/post-item" element={<PostItem />} />
        <Route path="/map" element={<Map />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/marketplace" element={<Marketplace />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
