import './index.css'; // Imports the styles for this page

// This component shows a "Page Not Found" screen
// It appears when the user visits a URL that doesn't exist in the app
// For example: typing "/abcxyz" in the address bar
const NotFound = () => (
  // Wrapper box — centers the image on the screen
  <div className="not-found-container">
    {/* A "404 / Page Not Found" image from an online link */}
    {/* alt="not-found" is shown if the image fails to load */}
    <img
      src="https://assets.ccbp.in/frontend/react-js/not-found-blog-img.png"
      alt="not-found"
      className="not-found-img"
    />
  </div>
);

export default NotFound; // Makes this component available to use in other files (like App.js)
