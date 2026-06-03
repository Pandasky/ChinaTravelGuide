import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GuideList from './pages/Guides/GuideList';
import GuideDetail from './pages/Guides/GuideDetail';

// AI
import AIAssistant from './pages/AI/AIAssistant';
import AIChat from './pages/AI/AIChat';

// User Center
import UserLayout from './components/UserCenter/UserLayout';
import Profile from './pages/User/Profile';
import MyGuides from './pages/User/MyGuides';
import Orders from './pages/User/Orders';
import Subscription from './pages/User/Subscription';
import Support from './pages/User/Support';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/guides" element={<GuideList />} />
          <Route path="/guides/:id" element={<GuideDetail />} />

          {/* AI Routes */}
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/ai-chat" element={<AIChat />} />

          {/* User Center Routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route path="profile" element={<Profile />} />
            <Route path="guides" element={<MyGuides />} />
            <Route path="orders" element={<Orders />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* TODO: Admin routes */}
          {/* <Route path="/admin/*" element={<Admin />} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
