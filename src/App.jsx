import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './Loginform';
import Home from './Home';
import './App.css';
import MealDetailsCard from './MealDetailsCard';
import ProtectedRoute from './PotectedRoute';
import NotFound from './NotFound';
import FavouritesCard from './FavouritesCard';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <FavouritesCard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meal/:mealId"
        element={
          <ProtectedRoute>
            <MealDetailsCard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
