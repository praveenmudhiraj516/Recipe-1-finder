import './index.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useParams gets the meal ID from the URL
import { BeatLoader } from 'react-spinners'; // Animated loading spinner
import { BsArrowLeft } from 'react-icons/bs'; // ← left arrow icon
import { AiTwotoneClockCircle } from 'react-icons/ai'; // 🕐 clock icon
import { GoPeople } from 'react-icons/go'; // 👥 people icon
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Heart icons for favorites
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const MealDetailsCard = () => {
  // ─── STATE ────────────────────────────────────────────────────────────────
  // Stores all the details of one meal fetched from the API
  // Starts as null (nothing loaded yet)
  const [mealFullDetails, setMealFullDetails] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // ─── GET MEAL ID FROM URL ─────────────────────────────────────────────────
  // If the URL is "/meal/53049", then mealId = "53049"
  const params = useParams();
  const { mealId } = params;

  // Hook to go back to the previous page when back button is clicked
  const navigate = useNavigate();

  // ─── FETCH MEAL DETAILS FROM API ──────────────────────────────────────────
  // Runs once when the page loads, or again if mealId changes in the URL
  useEffect(() => {
    const fetchMealFullDetails = async () => {
      // API call using the meal ID from the URL to get full recipe details
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
      );
      const data = await response.json();
      console.log(data);

      // API returns an array — we only need the first (and only) item
      setMealFullDetails(data.meals[0]);
    };

    fetchMealFullDetails();
  }, [mealId]); // re-runs if the meal ID in the URL changes

  // ─── LOAD FAVORITES FROM LOCALSTORAGE ──────────────────────────────────────
  useEffect(() => {
    const savedFavorites = localStorage.getItem('recipeFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // ─── FAVORITE TOGGLE HANDLER ─────────────────────────────────────────────
  const handleFavoriteToggle = (meal) => {
    const isFavorite = favorites.some((fav) => fav.idMeal === meal.idMeal);

    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter((fav) => fav.idMeal !== meal.idMeal);
    } else {
      updatedFavorites = [...favorites, meal];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('recipeFavorites', JSON.stringify(updatedFavorites));
  };

  // ─── CHECK IF MEAL IS FAVORITE ────────────────────────────────────────────
  const isMealFavorite = (mealId) => {
    return favorites.some((fav) => fav.idMeal === mealId);
  };

  // ─── SHOW LOADING SPINNER WHILE DATA IS BEING FETCHED ────────────────────
  // mealFullDetails is null until the API responds, so we show a spinner first
  // This also PREVENTS a crash — if we skipped this, the code below would
  // crash trying to read properties of null
  if (!mealFullDetails) {
    return (
      <div className="loader-container">
        <BeatLoader color="black" /> {/* Animated bouncing dots */}
      </div>
    );
  }

  // ─── BUILD INGREDIENTS LIST ───────────────────────────────────────────────
  // The MealDB API stores ingredients in a weird way:
  // strIngredient1, strIngredient2 ... strIngredient20 (up to 20 ingredients)
  // strMeasure1,    strMeasure2    ... strMeasure20    (matching amounts)
  // So we loop from 1 to 20 and collect any that are not empty
  let ingredientsList = [];

  for (let i = 1; i <= 20; i++) {
    let ingredient = mealFullDetails['strIngredient' + i]; // e.g. "Chicken"
    let measure = mealFullDetails['strMeasure' + i]; // e.g. "200g"

    // Only add to the list if the ingredient is not empty or blank
    if (ingredient && ingredient.trim() !== '') {
      ingredientsList.push(
        <li key={i} className="ingredient-item">
          <span>{ingredient}</span> {/* Ingredient name */}
          <span className="measure">{measure}</span> {/* How much of it */}
        </li>
      );
    }
  }
  console.log(ingredientsList);

  // ─── RENDER THE FULL MEAL DETAILS PAGE ───────────────────────────────────
  return (
    <div className="meal-details-card">
      {/* ── BACK BUTTON — goes to the previous page (search results) ── */}
      <button className="back-to-results" onClick={() => navigate(-1)}>
        <BsArrowLeft className="left-arrow" />
        Back to results
      </button>

      {/* ── TOP SECTION — image on left, info on right ── */}
      <div className="meal-details-content">
        {/* Large meal photo */}
        <img src={mealFullDetails.strMealThumb} alt={mealFullDetails.strMeal} />

        {/* Right side info block */}
        <div className="right-content">
          {/* Meal name heading */}
          <h2>{mealFullDetails.strMeal}</h2>
          {/* Badge labels — same style as in the card component */}
          <span className="tag veg">Vegetarian</span>{' '}
          {/* Hardcoded static badge */}
          <span className="tag region">{mealFullDetails.strArea}</span>{' '}
          {/* Country from API */}
          {/* Favorite Button */}
          <button
            className="favorite-btn-detail"
            onClick={() => handleFavoriteToggle(mealFullDetails)}
            title={
              isMealFavorite(mealFullDetails.idMeal)
                ? 'Remove from favorites'
                : 'Add to favorites'
            }
          >
            {isMealFavorite(mealFullDetails.idMeal) ? (
              <FaHeart className="heart-icon filled" />
            ) : (
              <FaRegHeart className="heart-icon" />
            )}
          </button>
          {/* Prep time and serving size row */}
          <div className="prep-serve">
            <span className="prep-text">
              <span className="prep-icon">
                <AiTwotoneClockCircle />
              </span>{' '}
              {/* Clock icon */}
              prep & cook time
            </span>
            <span className="prep-text">
              <span className="prep-icon">
                <GoPeople />
              </span>{' '}
              {/* People icon */}
              serves 4-6
            </span>
          </div>
          {/* YouTube link button — opens the recipe video in a new tab */}
          <a href={mealFullDetails.strYoutube} target="_blank" rel="noreferrer">
            <button className="video-btn">Watch Video Tutorial</button>
          </a>
        </div>
      </div>

      {/* ── BOTTOM SECTION — ingredients list + instructions ── */}
      <div className="extra-details">
        {/* LEFT — Ingredients list built from the loop above */}
        <div className="ingredients">
          <h3 className="ingredients-header">Ingredients</h3>
          <ul>{ingredientsList}</ul>
          {/* Renders all the <li> items we built in the loop */}
        </div>

        {/* RIGHT — Full cooking instructions */}
        <div className="instructions">
          <h3 className="instruction-header">Instructions</h3>
          <div className="instruction-para">
            {/* Split instructions by "." so each sentence becomes its own <p> tag */}
            {/* This makes a wall of text much easier to read */}
            {mealFullDetails.strInstructions.split('\n').map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
          <div className="source-container">
            <a
              href={mealFullDetails.strSource}
              target="_blank"
              rel="noreferrer"
              className="source-link"
            >
              View Source
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDetailsCard;
