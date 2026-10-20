import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { Analytics } from "@vercel/analytics/react";

// =====================================================
// PAGES
// =====================================================

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Subjects from "./pages/Subjects";
import Attendance from "./pages/Attendance";
import Exams from "./pages/Exams";
import Results from "./pages/Results";
import Finance from "./pages/Finance";
import Fee from "./pages/Fee";
import Settings from "./pages/Settings";
import WhatsApp from "./pages/WhatsApp";

// =====================================================
// LAYOUT
// =====================================================

import AdminLayout from "./layouts/AdminLayout";

// =====================================================
// PROTECTED ROUTE
// =====================================================

import ProtectedRoute from "./components/ProtectedRoute";


// =====================================================
// APP
// =====================================================

function App() {

    return (

        <BrowserRouter>

            <Analytics />

            <Routes>

                {/* =================================================
                    LOGIN
                ================================================= */}

                <Route
                    path="/"
                    element={<Login />}
                />


                {/* =================================================
                    ADMIN SYSTEM
                ================================================= */}

                <Route
                    element={<AdminLayout />}
                >

                    {/* =================================================
                        DASHBOARD
                    ================================================= */}

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        STUDENTS
                    ================================================= */}

                    <Route
                        path="/students"
                        element={
                            <ProtectedRoute>
                                <Students />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        TEACHERS
                    ================================================= */}

                    <Route
                        path="/teachers"
                        element={
                            <ProtectedRoute>
                                <Teachers />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        CLASSES
                    ================================================= */}

                    <Route
                        path="/classes"
                        element={
                            <ProtectedRoute>
                                <Classes />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        SUBJECTS
                    ================================================= */}

                    <Route
                        path="/subjects"
                        element={
                            <ProtectedRoute>
                                <Subjects />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        ATTENDANCE
                    ================================================= */}

                    <Route
                        path="/attendance"
                        element={
                            <ProtectedRoute>
                                <Attendance />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        EXAMS
                    ================================================= */}

                    <Route
                        path="/exams"
                        element={
                            <ProtectedRoute>
                                <Exams />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        RESULTS
                    ================================================= */}

                    <Route
                        path="/results"
                        element={
                            <ProtectedRoute>
                                <Results />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        FINANCE
                    ================================================= */}

                    <Route
                        path="/finance"
                        element={
                            <ProtectedRoute>
                                <Finance />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        FEES
                    ================================================= */}

                    <Route
                        path="/fees"
                        element={
                            <ProtectedRoute>
                                <Fee />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        SETTINGS
                    ================================================= */}

                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <Settings />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        WHATSAPP
                    ================================================= */}

                    <Route
                        path="/whatsapp"
                        element={
                            <ProtectedRoute>
                                <WhatsApp />
                            </ProtectedRoute>
                        }
                    />

                </Route>


                {/* =================================================
                    UNKNOWN URL
                ================================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;