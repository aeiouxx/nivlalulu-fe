import './App.css';
import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import TemplateEditor from './pages/TemplateEditor';
import InvoiceViewer from './pages/InvoiceViewer';
import Profil from './pages/Profil';
import {CssBaseline, Container} from '@mui/material';
import InvoiceEditor from "./pages/InvoiceEditor";
import IndexPage from "./pages/IndexPage";
import IndexLayout from "./layouts/IndexLayout";
import AppLayout from "./layouts/AppLayout";

function App() {
    return (
        <Router>
            <CssBaseline/>
            <Routes>
                {/* Veřejné trasy */}
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>

                {/* Chráněné trasy */}
                {/* TODO PŘIDAT  <Route element={<ProtectedRoute />}>*/}
                <Route path="/" element={<IndexLayout><IndexPage/></IndexLayout>}/>
                <Route path="/dashboard" element={<AppLayout><Dashboard/></AppLayout>}/>
                <Route path="/profil" element={<AppLayout><Profil/></AppLayout>}/>
                <Route path="/template/:id" element={<AppLayout><TemplateEditor/></AppLayout>}/>
                <Route path="/invoice/:id" element={<AppLayout><InvoiceViewer/></AppLayout>}/>
                <Route path="/invoice/update/:id" element={<AppLayout><InvoiceEditor/></AppLayout>}/>


                {/* Trvalá trasa pro neplatné cesty */}
                <Route path="*" element={<Navigate to="/login"/>}/>
            </Routes>
        </Router>
    );
}

export default App;
