import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

const LoginForm = () => {
  // ─── STATE DECLARATIONS ───────────────────────────────────────────────────
  const [username, setUsername] = useState(''); // Tracks username input value
  const [password, setPassword] = useState(''); // Tracks password input value
  const [showSubmitError, setShowSubmitError] = useState(false); // Controls error message visibility
  const [errorMsg, setErrorMsg] = useState(''); // Stores error message from API

  const navigate = useNavigate(); // Hook to redirect user after login

  // ─── INPUT CHANGE HANDLERS ────────────────────────────────────────────────
  // Updates username state on every keystroke
  const onChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  // Updates password state on every keystroke
  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  // ─── RENDER USERNAME FIELD ────────────────────────────────────────────────
  // Returns label + controlled text input for username
  const renderUsernameField = () => (
    <>
      <label className="input-label" htmlFor="username">
        USERNAME
      </label>
      <input
        type="text"
        id="username"
        className="username-input-field"
        value={username} // Controlled input — tied to state
        onChange={onChangeUsername} // Updates state on each keystroke
        placeholder="Username"
      />
    </>
  );

  // ─── RENDER PASSWORD FIELD ────────────────────────────────────────────────
  // Returns label + controlled password input (characters hidden)
  const renderPasswordField = () => (
    <>
      <label className="input-label" htmlFor="password">
        PASSWORD
      </label>
      <input
        type="password" // Hides characters as user types
        id="password"
        className="password-input-field"
        value={password} // Controlled input — tied to state
        onChange={onChangePassword}
        placeholder="Password"
      />
    </>
  );

  // ─── LOGIN SUCCESS HANDLER ────────────────────────────────────────────────
  // Saves JWT token in a cookie and redirects to home page
  const onSubmitSuccess = (jwtToken) => {
    Cookies.set('jwt_token', jwtToken, { expires: 30 }); // Cookie valid for 30 days
    navigate('/', { replace: true }); // Redirect to home, replace login in browser history
  };

  // ─── LOGIN FAILURE HANDLER ────────────────────────────────────────────────
  // Shows error message returned from the API
  const onSubmitFailure = (errorMsg) => {
    setShowSubmitError(true); // Make error message visible
    setErrorMsg(errorMsg); // Store the error text from API response
  };

  // ─── FORM SUBMIT — API CALL ───────────────────────────────────────────────
  const submitForm = async (event) => {
    event.preventDefault(); // Prevent default page reload on form submit

    const userDetails = { username, password }; // Bundle credentials

    // POST request to login API with credentials in request body
    const url = 'https://apis.ccbp.in/login';
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails), // Convert object to JSON string
    };

    const response = await fetch(url, options);
    console.log(response);

    const data = await response.json(); // Parse JSON response body
    console.log(data);

    // Route to success or failure based on HTTP status
    if (response.ok === true) {
      onSubmitSuccess(data.jwt_token); // Pass token to success handler
    } else {
      onSubmitFailure(data.error_msg); // Pass error message to failure handler
    }
  };

  // ─── AUTH GUARD ───────────────────────────────────────────────────────────
  // If user is already logged in (cookie exists), skip login and go to home
  const jwtToken = Cookies.get('jwt_token');
  if (jwtToken !== undefined) {
    return <Navigate to="/" />; // Redirect away from login page
  }

  // ─── RENDER LOGIN FORM ────────────────────────────────────────────────────
  return (
    <div className="login-form-container">
      <form className="form-container" onSubmit={submitForm}>
        {/* Username input field */}
        <div className="input-container">{renderUsernameField()}</div>

        {/* Password input field */}
        <div className="input-container">{renderPasswordField()}</div>

        {/* Submit button — triggers submitForm via onSubmit */}
        <button type="submit" className="login-button">
          Login
        </button>

        {/* Error message — only visible when showSubmitError is true */}
        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
