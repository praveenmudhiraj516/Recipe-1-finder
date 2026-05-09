import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import MealCardItem from '../MealCard';
import './index.css';

const FavouritesCard = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  // ─── LOAD FAVORITES FROM LOCALSTORAGE ON MOUNT ────────────────────────────
  useEffect(() => {
    const savedFavorites = localStorage.getItem('recipeFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
      console.log('Loaded favorites:', JSON.parse(savedFavorites));
    } else {
      console.log('No saved favorites');
    }
  }, []);

  // ─── HANDLE FAVORITE REMOVAL ──────────────────────────────────────────────
  const handleFavoriteToggle = (meal) => {
    const updatedFavorites = favorites.filter(
      (fav) => fav.idMeal !== meal.idMeal
    );
    setFavorites(updatedFavorites);
    localStorage.setItem('recipeFavorites', JSON.stringify(updatedFavorites));
  };

  // ─── CHECK IF MEAL IS FAVORITE ────────────────────────────────────────────
  const isMealFavorite = (mealId) => {
    return favorites.some((fav) => fav.idMeal === mealId);
  };

  // ─── LOGOUT HANDLER ───────────────────────────────────────────────────────
  //   const toLogout = () => {
  //     localStorage.removeItem('recipeSearchText');
  //     localStorage.removeItem('recipeSearchResults');
  //     localStorage.removeItem('recipeFavorites');
  //     Cookies.remove('jwt_token');
  //     navigate('/login');
  //   };

  const toLogout = () => {
    localStorage.removeItem('recipeSearchText');
    localStorage.removeItem('recipeSearchResults');
    localStorage.removeItem('recipeFavorites');
    Cookies.remove('jwt_token');
    navigate('/login');
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="favorites-container">
      {/* Logout Button — top-right area */}
      <div className="to-logout-button">
        <Link to="/home" className="back-link">
          ← Back to Home
        </Link>
        <button className="to-back" onClick={toLogout}>
          Logout
        </button>
      </div>

      {/* Page Header */}
      <div className="top-section-home">
        <h1>❤️ My Favorite Recipes</h1>
        <p className="top-heading">Your saved recipes collection</p>
      </div>

      {/* Favorites Count */}
      <div className="result-num-div">
        {favorites.length > 0 && (
          <p className="result-items">
            {`You have ${favorites.length} favorite recipe${favorites.length !== 1 ? 's' : ''}`}
          </p>
        )}
      </div>

      {/* Favorites Grid */}
      <div className="results-section">
        {favorites.length === 0 ? (
          <div className="no-favorites">
            <p className="no-favorites-msg">
              No favorites yet! Start adding your favorite recipes.
            </p>
            <Link to="/home" className="back-link-btn">
              Continue Searching
            </Link>
          </div>
        ) : (
          favorites.map((meal) => (
            <div
              key={meal.idMeal}
              className="meal-card"
              onClick={() => navigate(`/meal/${meal.idMeal}`)}
            >
              <MealCardItem
                meal={meal}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorite={isMealFavorite(meal.idMeal)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FavouritesCard;
