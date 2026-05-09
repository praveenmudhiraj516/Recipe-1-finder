import './index.css';
import { useState } from 'react'; // useState lets us remember things inside a component
import { MdOutlineArrowRightAlt } from 'react-icons/md'; // This is a right arrow "→" icon
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Heart icons for favorites

// This component shows ONE recipe card on the screen
// It receives "meal" which contains all the recipe information (name, image, instructions etc.)
// It also receives a callback function to update favorites in the parent component
const MealCardItem = ({ meal, onFavoriteToggle, isFavorite }) => {
  // ─── REMEMBER IF USER CLICKED "SHOW MORE" OR NOT ─────────────────────────
  // showMore = false means → show only a short preview of the recipe
  // showMore = true  means → show the full recipe instructions
  const [showMore, setShowMore] = useState(false); // starts as false (short preview)

  // ─── THIS FUNCTION RUNS WHEN USER CLICKS THE BUTTON ──────────────────────
  const handleButtonClick = () => {
    if (showMore === true) {
      setShowMore(false); // if full recipe is showing → hide it (go back to preview)
    } else {
      setShowMore(true); // if preview is showing → show full recipe
    }
  };

  // ─── HANDLE FAVORITE BUTTON CLICK ──────────────────────────────────────────
  const handleFavoriteClick = (event) => {
    event.stopPropagation(); // Stop the card from navigating to detail page
    onFavoriteToggle(meal); // Call parent function to add/remove from favorites
  };

  // ─── WHAT THE CARD LOOKS LIKE ON SCREEN ──────────────────────────────────
  return (
    // The big box (card) that wraps everything

    <div className="result-item meal-card" data-id={meal.idMeal}>
      {/* Recipe photo */}
      <img src={meal.strMealThumb} alt={meal.strMeal} />

      {/* Favorite Button — top right corner */}
      <button
        type="button"
        className="favorite-btn"
        onClick={handleFavoriteClick}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? (
          <FaHeart className="heart-icon filled" />
        ) : (
          <FaRegHeart className="heart-icon" />
        )}
      </button>

      {/* Recipe name as a heading */}
      <h2>{meal.strMeal}</h2>
      {/* Two small badge labels below the name */}
      <div className="tag-container">
        {/* This badge always says "Vegetarian" on every card (it's hardcoded, not from API) */}
        <span className="tag veg">Vegetarian</span>

        {/* This badge shows which country the recipe is from e.g. "Indian", "Italian" */}
        <span className="tag region">{meal.strArea}</span>
      </div>
      {/* Recipe instructions text */}
      <p>
        {showMore
          ? meal.strInstructions // show FULL text when button is clicked
          : meal.strInstructions.slice(0, 270) + '...'}{' '}
      </p>
      {/* Button to expand or collapse the recipe instructions */}
      <div>
        <button
          className="to-show"
          onClick={(event) => {
            // stopPropagation stops the click from also opening the recipe detail page
            // (because this card is wrapped inside a clickable <Link> in Home.jsx)
            event.stopPropagation();

            handleButtonClick(); // toggle between show more / show less
          }}
        >
          {/* Button text changes based on whether full recipe is showing or not */}
          {showMore === true ? 'Show Less' : 'click for full recipe'}

          {/* The little → arrow icon always shows next to the button text */}
          <MdOutlineArrowRightAlt className="icon" />
        </button>
      </div>
    </div>
  );
};

export default MealCardItem;
