import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Settings } from './pages/Settings';
import { UserManagement } from './pages/admin/UserManagement';
import { FleetOverview } from './pages/FleetOverview';
import { WorkOrders } from './pages/WorkOrders';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <Layout>
              <FleetOverview />
            </Layout>
          } />
          <Route path="/settings" element={
            <Layout>
              <Settings />
            </Layout>
          } />
          <Route path="/work-orders" element={
            <Layout>
              <WorkOrders />
            </Layout>
          } />
          <Route path="/admin/users" element={
            <Layout>
              <UserManagement />
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
