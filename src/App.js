import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';
import HomePage from './pages/HomePage';
import UserRegister from './pages/UserRegister';
import AdminDashboard from './pages/AdminDashboard';
import EditEvent from './pages/EditEvent';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/userCreateEvent';
import UpdateEvent from './pages/UserUpdateEvent';
import EventPage from './pages/UserEvents';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path='/events' element={<EventPage />} />
        <Route path="/events/create" element={<CreateEvent />} />
        <Route path="/events/update/:id" element={<UpdateEvent />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/edit-event/:eventId" element={<EditEvent />} />
      </Routes>
    </Router>
  );
}

export default App;
