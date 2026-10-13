import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { NavigatePage } from './pages/NavigatePage';
import { BuildingDetailPage } from './pages/BuildingDetailPage';
import { AccessibilityPage } from './pages/AccessibilityPage';
import { ReportPage } from './pages/ReportPage';
import { AdminPage } from './pages/AdminPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/navigate" element={<NavigatePage />} />
          <Route path="/building/:id" element={<BuildingDetailPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
