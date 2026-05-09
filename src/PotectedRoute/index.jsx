import { Navigate } from 'react-router-dom'; // Used to redirect user to a different page
import Cookies from 'js-cookie'; // Used to read the saved login token from the browser

// ProtectedRoute is a "security guard" component
// It checks if the user is logged in before allowing them to see a page
// If NOT logged in → sends them to the login page
// If logged in     → shows them the page they wanted to visit
//
// "children" means whatever page/component is wrapped inside this guard
// Example in App.js:
// <ProtectedRoute>
//   <Home />        ← this is "children"
// </ProtectedRoute>

const ProtectedRoute = ({ children }) => {
  // Check if a login token exists in the browser cookies
  // token = undefined means the user is NOT logged in
  // token = "abc123..." means the user IS logged in
  const token = Cookies.get('jwt_token');

  // If no token found → user is not logged in → send them to login page
  // "replace" means the login page REPLACES this page in browser history
  // so pressing the back button won't bring them back here
  if (token === undefined) {
    return <Navigate to="/login" replace />;
  }

  // If token exists → user is logged in → show the actual page they wanted
  return children;
};

export default ProtectedRoute;
