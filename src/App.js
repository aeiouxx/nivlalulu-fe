import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard'; // Nastavte `Dashboard` jako hlavní stránku po přihlášení
import TemplateEditor from './pages/TemplateEditor'; // Editor šablon
import InvoiceViewer from './pages/InvoiceViewer';
import Profil from './pages/Profil';
import ProtectedRoute from './components/ProtectedRoute';
import { CssBaseline, Container } from '@mui/material';

function App() {
    return (
        <Router>
            <CssBaseline />
            <Container>
                <Routes>
                    {/* Veřejné trasy */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Chráněné trasy */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/profil" element={<Profil />} />
                        <Route path="/template/:id" element={<TemplateEditor />} /> {/* Editor šablon */}
                        <Route path="/invoice/:id" element={<InvoiceViewer />} />
                    </Route>

                    {/* Trvalá trasa pro neplatné cesty */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
