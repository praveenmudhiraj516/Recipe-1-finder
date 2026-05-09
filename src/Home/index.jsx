import { useEffect, useState } from 'react';
import MealCardItem from '../MealCard';
import './index.css';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ClipLoader } from 'react-spinners';

const Home = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate between routes

  // ─── STATE DECLARATIONS ───────────────────────────────────────────────────
  const [inputValue, setInputValue] = useState(''); // Tracks live text typed in the search input
  const [searchText, setSearchText] = useState(''); // Holds the confirmed search term (set on form submit)
  const [searchResults, setSearchResults] = useState([]); // Stores the array of meal objects returned from the API
  const [showButtons, setShowButtons] = useState(true); // Controls visibility of the quick-category buttons
  const [favorites, setFavorites] = useState([]); // Stores favorite meals

  // ─── RESTORE PREVIOUS SESSION DATA FROM LOCALSTORAGE ─────────────────────
  // Runs once on mount — if the user had searched before, reload that state
  useEffect(() => {
    const savedSearchText = localStorage.getItem('recipeSearchText');
    const savedSearchResults = localStorage.getItem('recipeSearchResults');
    const savedFavorites = localStorage.getItem('recipeFavorites');

    if (savedSearchText) {
      setSearchText(savedSearchText); // Restore last search term
      setShowButtons(false); // Hide category buttons since results exist
    }

    if (savedSearchResults) {
      const parsedData = JSON.parse(savedSearchResults);
      setSearchResults(parsedData); // Restore last search results
    }

    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites);
      setFavorites(parsedFavorites); // Restore favorites list
    }
  }, []);

  // ─── HANDLE SEARCH FORM SUBMISSION ───────────────────────────────────────
  const onSubmitSearch = (event) => {
    event.preventDefault(); // Prevent page reload on form submit
    setSearchText(inputValue); // Trigger the API fetch by updating searchText
    setShowButtons(false); // Hide the category buttons after search
    localStorage.setItem('recipeSearchText', inputValue); // Persist search term
    setInputValue(''); // Clear the input field
  };

  // ─── FETCH RECIPES FROM API WHENEVER searchText CHANGES ──────────────────
  useEffect(() => {
    const getRecipes = async () => {
      if (searchText === '') return; // Skip fetch if search term is empty

      const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(data);

      if (data.meals) {
        setSearchResults(data.meals); // Update state with fetched meals
        localStorage.setItem('recipeSearchResults', JSON.stringify(data.meals)); // Persist results
      } else {
        setSearchResults([]); // No meals found — clear results
      }
    };

    getRecipes();
  }, [searchText]); // Re-runs every time searchText changes

  // ─── LOGOUT HANDLER ───────────────────────────────────────────────────────
  const toLogout = () => {
    localStorage.removeItem('recipeSearchText'); // Clear persisted search term
    localStorage.removeItem('recipeSearchResults'); // Clear persisted results
    Cookies.remove('jwt_token'); // Remove auth token cookie
    navigate('/login'); // Redirect user to login page
  };

  // ─── FAVORITE TOGGLE HANDLER ─────────────────────────────────────────────
  // This function adds or removes a meal from favorites
  const handleFavoriteToggle = (meal) => {
    const isFavorite = favorites.some((fav) => fav.idMeal === meal.idMeal);

    let updatedFavorites;
    if (isFavorite) {
      // Remove from favorites if already there
      updatedFavorites = favorites.filter((fav) => fav.idMeal !== meal.idMeal);
    } else {
      // Add to favorites if not there
      updatedFavorites = [...favorites, meal];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('recipeFavorites', JSON.stringify(updatedFavorites));
    console.log('Favorites updated:', updatedFavorites);
  };

  // ─── CHECK IF MEAL IS FAVORITE ────────────────────────────────────────────
  // Returns true if a meal is in the favorites list
  const isMealFavorite = (mealId) => {
    return favorites.some((fav) => fav.idMeal === mealId);
  };

  // ─── QUICK CATEGORY BUTTONS SECTION ──────────────────────────────────────
  // Renders a welcome message + preset category buttons (Chicken, Pasta, etc.)
  // Shown only when no search results are present
  const buttons = () => {
    return (
      <div>
        {/* Welcome Banner */}
        <div className="top-section-details">
          <div>
            <h1>👨‍🍳</h1>
          </div>
          <div>
            <h2 id="to-search-heading">
              Ready to cook something amazing?
            </h2>
            <p className="to-search-description">
              Search recipes by entering ingredient you have or name of dish you'd like to make. 
            </p>
          </div>
        </div>

        {/* Preset Category Buttons — each sets searchText directly, bypassing the form */}
        <div className="button-container">
          <button
            className="btn chicken"
            onClick={() => {
              setSearchText('chicken');
              setShowButtons(false);
            }}
          >
            CHICKEN
          </button>
          <button
            className="btn pasta"
            onClick={() => {
              setSearchText('pasta');
              setShowButtons(false);
            }}
          >
            PASTA
          </button>
          <button
            className="btn beef"
            onClick={() => {
              setSearchText('beef');
              setShowButtons(false);
            }}
          >
            BEEF
          </button>
          <button
            className="btn salad"
            onClick={() => {
              setSearchText('salad');
              setShowButtons(false);
            }}
          >
            SALAD
          </button>
          <button
            className="btn soup"
            onClick={() => {
              setSearchText('soup');
              setShowButtons(false);
            }}
          >
            SOUP
          </button>
          <button
            className="btn chocolate"
            onClick={() => {
              setSearchText('chocolate');
              setShowButtons(false);
            }}
          >
            CHOCOLATE
          </button>
        </div>
      </div>
    );
  };
  const renderLoader = () => {
    return (
      <div className="loader-container">
        <ClipLoader color="black" />
      </div>
    );
  };

  // ─── MAIN RENDER ──────────────────────────────────────────────────────────
  return (
    <div className="home-container">
      {/* Logout Button and Favorites Link — top-right area */}
      <div className="to-logout-button">
        <Link to="/favorites" className="favorites-link">
          ❤️ Favorites ({favorites.length})
        </Link>
        <button className="to-back" onClick={toLogout}>
          Logout
        </button>
      </div>

      {/* Page Header */}
      <div className="top-section-home">
        <h1>🍳 Recipe Finder</h1>
        <p className="top-heading">
          Discover delicious recipes by ingredient or dish name
        </p>
      </div>

      {/* Search Bar — controlled input + submit button */}
      <div className="search-box">
        <form onSubmit={onSubmitSearch}>
          <input
            type="search"
            value={inputValue}
            placeholder="Search by ingredient or recipe name (e.g., chicken, pasta)..."
            onChange={(event) => setInputValue(event.target.value)} // Update inputValue on every keystroke
            className="search-field"
          />
          <button type="submit" className="button-search">
            Search
          </button>
        </form>
      </div>

      {/* Show category buttons only when there are no results */}
      <div>{searchResults.length > 0 ? null : buttons()}</div>

      {/* Results Count — shown only when meals are found */}
      <div className="result-num-div">
        {searchResults.length > 0 && (
          <p className="result-items">{`Found ${searchResults.length} recipes for "${searchText}"`}</p>
        )}
      </div>

      {/* Meal Cards Grid — each card links to the individual meal detail page */}

      <div className="results-section">
        {searchResults.length === 0 && renderLoader()}
        {/* Show loader while waiting for API response */}
        {searchResults.length > 0 ? (
          searchResults.map((meal) => (
            <div
              key={meal.idMeal}
              className="meal-card"
              onClick={() => navigate(`/meal/${meal.idMeal}`)}
            >
              <MealCardItem
                meal={meal}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorite={isMealFavorite(meal.idMeal)}
              />{' '}
              {/* Renders a single meal card with image, name, etc. */}
            </div>
          ))
        ) : (
          // Fallback message when search returns no results
          <div className="not-found" id='not-found-container'>
            <p className="not-f">No Recipes Found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
