import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { I18nProvider } from '@/i18n';
import { HomePage } from '@/pages/HomePage';

const RootRedirect: React.FC = () => {
  const saved = localStorage.getItem('turquoise_preferred_lang');
  if (saved && ['ar', 'fr', 'en'].includes(saved)) {
    return <Navigate to={`/${saved}`} replace />;
  }
  const browser = navigator.language.slice(0, 2).toLowerCase();
  const target = browser === 'fr' ? 'fr' : browser === 'en' ? 'en' : 'ar';
  return <Navigate to={`/${target}`} replace />;
};

const LocalizedRoute: React.FC = () => {
  const { lang } = useParams<{ lang?: string }>();
  if (!lang || !['ar', 'fr', 'en'].includes(lang)) {
    return <Navigate to="/ar" replace />;
  }

  return (
    <I18nProvider>
      <HomePage />
    </I18nProvider>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/:lang" element={<LocalizedRoute />} />
        <Route path="/:lang/*" element={<LocalizedRoute />} />
        <Route path="*" element={<Navigate to="/ar" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
