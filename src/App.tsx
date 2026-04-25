/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { AppProvider, useAppContext } from './store/AppContext';
import { TopNav } from './components/TopNav';
import { GlobalFAB } from './components/GlobalFAB';
import { GlobalGifts } from './components/GlobalGifts';
import { CherryBlossoms } from './components/CherryBlossoms';
import { ToastProvider } from './context/ToastContext';   // ← ADD THIS
import { Splash } from './pages/Splash';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { ProfileDashboard } from './pages/ProfileDashboard';
import { Goals } from './pages/Goals';
import { Budget } from './pages/Budget';
import { Notes } from './pages/Notes';
import { Birthday } from './pages/Birthday';
import { Meetings } from './pages/Meetings';
import { AnimatePresence } from 'motion/react';
import React from 'react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAppContext();
  if (!currentUser) return <Navigate to="/login" replace />;
  return (
    <>
      <TopNav />
      <div className="pt-32 min-h-screen">
        {children}
      </div>
      <GlobalFAB />
    </>
  );
}

function MainRoutes() {
  const location = useLocation();
  return (
    <>
      <CherryBlossoms />
      <div className="color-orb-1"></div>
      <div className="color-orb-2"></div>
      <div className="color-orb-3"></div>
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname} {...({} as any)}>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfileDashboard /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          <Route path="/meetings" element={<ProtectedRoute><Meetings /></ProtectedRoute>} />
          <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          <Route path="/birthday" element={<ProtectedRoute><Birthday /></ProtectedRoute>} />
          <Route path="/dashboard" element={<Navigate to="/home" replace />} />
        </Routes>
      </AnimatePresence>
      <GlobalGifts />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ToastProvider>      {/* ← ADD THIS */}
          <MainRoutes />
        </ToastProvider>     {/* ← ADD THIS */}
      </BrowserRouter>
    </AppProvider>
  );
}
