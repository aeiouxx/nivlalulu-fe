import './App.css';
import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, Outlet} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import TemplateEditor from './pages/TemplateEditor';
import InvoiceViewer from './pages/InvoiceViewer';
import Profil from './pages/Profil';
import {CssBaseline} from '@mui/material';
import InvoiceEditor from "./pages/InvoiceEditor";
import IndexPage from "./pages/IndexPage";
import AppLayout from "./layouts/AppLayout";
import store from "./utils/redux/store";
import {Provider, useSelector} from "react-redux";
import {ResetPasswordPage} from "./pages/ResetPasswordPage";

const ProtectedRoute = () => {
    const isLoggedIn = useSelector((state) => state.auth.username != null);

    if (!isLoggedIn) {
        return <Navigate to="/" replace/>;
    }

    return <Outlet/>;
};

function App() {
    return (
        <Provider store={store}>
            <Router>
                <CssBaseline/>
                <AppLayout>
                    <Routes>
                        {/* Veřejné trasy */}
                        <Route path="/" element={<IndexPage/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/register" element={<RegisterPage/>}/>
                        <Route path="/resetPassword" element={<ResetPasswordPage/>}/>

                        {/* Chráněné trasy */}
                        <Route element={<ProtectedRoute/>}>
                            <Route path="/dashboard" element={<Dashboard/>}/>
                            <Route path="/profil" element={<Profil/>}/>
                            <Route path="/template/:id" element={<TemplateEditor/>}/>
                            <Route path="/invoice/:id" element={<InvoiceViewer/>}/>
                            <Route path="/invoice/update/:id" element={<InvoiceEditor/>}/>
                        </Route>

                        {/* Trvalá trasa pro neplatné cesty */}
                        <Route path="*" element={<Navigate to="/"/>}/>
                    </Routes>
                </AppLayout>
            </Router>
        </Provider>
    );
}

export default App;

