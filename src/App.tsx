import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AppLayout from './components/AppLayout';
import RegistrationPage from './pages/RegistrationPage';

export default function App() {
  return (
    <ConfigProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<RegistrationPage />} />
          </Routes>
        </AppLayout>
      </Router>
    </ConfigProvider>
  );
}