import { Routes, Route } from 'react-router-dom';
import React from 'react';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Templates from './pages/Templates';
import TemplateDetail from './pages/TemplateDetail';
import MyDocuments from './pages/MyDocuments';
import Editor from './pages/Editor';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminTemplates from './pages/admin/Templates';
import AdminCategories from './pages/admin/Categories';

export default function Root() {
    console.log('Root component rendering...');
    return (
        <AuthProvider>
            <Toaster position="top-right" />
            <Routes>
                {/* Public Routes */}
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/templates" element={<Templates />} />
                    <Route path="/templates/:id" element={<TemplateDetail />} />
                </Route>

                {/* Protected Routes */}
                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/my-documents" element={<MyDocuments />} />
                    <Route path="/editor" element={<Editor />} />
                    <Route path="/editor/:templateId" element={<Editor />} />
                    <Route path="/editor/document/:documentId" element={<Editor />} />
                </Route>

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <Layout />
                        </AdminRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="templates" element={<AdminTemplates />} />
                    <Route path="categories" element={<AdminCategories />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
}
