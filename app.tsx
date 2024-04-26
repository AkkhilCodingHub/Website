// app.tsx

import React from 'react';
import { useRouter } from 'next/router';

// Import your page components
import Home from '@/pages/index';
import Login from '@/component/Auth/LoginPage';
import Upload from '@/pages/admin/upload';
import Dashboard from '@/pages/admin/dashboard';

function App() {
  const router = useRouter();

  // Define routes based on URL paths
  const getPageComponent = () => {
    switch (router.pathname) {
      case '/':
        return <Home />;
      case '/login':
        return <Login />;
      case '/upload':
        return <Upload />;
      case '/dashboard':
        return <Dashboard />;
      default:
        return <div>404: Not Found</div>; // Handle unrecognized routes
    }
  };

  return (
    <div className="app">
      {/* Render the appropriate page component based on the route */}
      {getPageComponent()}
    </div>
  );
}

export default App;
