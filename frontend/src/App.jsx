import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CreateEquipment from './pages/Equipment/CreateEquipment';
import EditEquipment from './pages/Equipment/EditEquipment'; // Import this
import EquipmentTable from './pages/Equipment/EquipmentTable';
import TeamsPage from './pages/TeamPage';
import RequestForm from './pages/RequestForm';
import WorkCenter from './pages/WorkCenter'; // Import WorkCenter
import ResourceManagement from './pages/ResourceManagement'; // NEW PAGE for Admin Config
import Profile from './pages/Profile';
import WorkCenterPage from './pages/WorkCenter';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />

        {/* Equipment Routes */}
        <Route path="/equipment" element={<EquipmentTable />} />
        <Route path="/eq/all" element={<EquipmentTable />} />
        <Route path="/equipment/create" element={<CreateEquipment />} />
        <Route path="/equipment/edit/:id" element={<EditEquipment />} />
        
        {/* Operations */}
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/requests" element={<RequestForm />} />
        <Route path="/work-centers" element={<WorkCenterPage />} />

        {/* ADMIN ONLY: Master Data (Departments, Categories, Companies) */}
        <Route path="/admin/configuration" element={<ResourceManagement />} />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div className="p-10">404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;