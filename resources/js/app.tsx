import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Templates from './pages/Templates';
import TemplateDetail from './pages/TemplateDetail';
import Editor from './pages/Editor';
import MyDocuments from './pages/MyDocuments';
import AdminDashboard from './pages/admin/Dashboard';
import AdminTemplates from './pages/admin/Templates';
import AdminCategories from './pages/admin/Categories';
import AdminUsers from './pages/admin/Users';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="templates" element={<Templates />} />
                    <Route path="templates/:id" element={<TemplateDetail />} />
                    <Route
                        path="editor/:templateId"
                        element={
                            <ProtectedRoute>
                                <Editor />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="editor/document/:documentId"
                        element={
                            <ProtectedRoute>
                                <Editor />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="my-documents"
                        element={
                            <ProtectedRoute>
                                <MyDocuments />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="admin"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="admin/templates"
                        element={
                            <AdminRoute>
                                <AdminTemplates />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="admin/categories"
                        element={
                            <AdminRoute>
                                <AdminCategories />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="admin/users"
                        element={
                            <AdminRoute>
                                <AdminUsers />
                            </AdminRoute>
                        }
                    />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="top-right" />
        </AuthProvider>
    );
}

export default App;

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}
