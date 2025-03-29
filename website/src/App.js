import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import NEPsPage from './pages/NEPsPage';
import NEPDetailPage from './pages/NEPDetailPage';
import WorkingNEPsPage from './pages/WorkingNEPsPage';
import AboutPage from './pages/AboutPage';
import SearchPage from './pages/SearchPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/neps" element={<NEPsPage />} />
        <Route path="/nep/:nepNumber" element={<NEPDetailPage />} />
        <Route path="/working-neps" element={<WorkingNEPsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;