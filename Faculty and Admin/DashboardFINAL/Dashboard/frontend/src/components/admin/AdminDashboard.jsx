import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminHome from '@/components/admin/AdminHome';
import TrackResources from '@/components/admin/TrackResources';
import ManageClassrooms from '@/components/admin/ManageClassrooms';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/home" replace />} />
        <Route path="/home" element={<AdminHome />} />
        <Route path="/track-resources" element={<TrackResources />} />
        <Route path="/manage-classrooms" element={<ManageClassrooms />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;