import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import { Layout } from './src/components/layout/Layout';
import { Toaster } from 'react-hot-toast';

// Auth Components
import { Login } from './src/components/auth/Login';
import { ProtectedRoute } from './src/components/auth/ProtectedRoute';
import { Register } from './src/components/auth/Register';
import { Verification } from './src/components/auth/Verification';

// Feature Components
import { Browse } from './src/components/listings/Browse';
import { CreateListing } from './src/components/listings/CreateListing';
import { Home } from './src/components/home/Home';
import { Inbox } from './src/components/messages/Inbox';
import { ListingDetail } from './src/components/listings/ListingDetail';
import { MyListings } from './src/components/dashboard/MyListings';
import { Settings } from './src/components/profile/Settings';
import { Contact } from './src/components/common/Contact';
import { PrivacyPolicy } from './src/components/legal/PrivacyPolicy';
import { TermsOfService } from './src/components/legal/TermsOfService';
import { HelpCenter } from './src/components/legal/HelpCenter';
const App = (): React.ReactElement => {
  return (
    <Layout>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/help" element={<HelpCenter />} />
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MyListings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/listings/create" 
          element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/inbox" 
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Layout>
  );
};

export default App;