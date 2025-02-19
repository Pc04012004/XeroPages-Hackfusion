import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios'; // Import axios for API calls

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to handle error messages

  // Handle the sign-in action and redirect to home page
  const handleSignIn = async (event) => {
    event.preventDefault();

    const userData = {
      email: email, // Email field
      pass: password, // Password field (matching the API's expected key)
    };

    try {
      // Send a POST request to the Django API endpoint
      const response = await axios.post('http://127.0.0.1:8000/login/', userData);

      // Check if the response is successful
      if (response.status === 200) {
        // Extract user data from the response
        const user = response.data.user;

        // Store user data in localStorage or context (optional)
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect to the home page on successful login
        navigate('/home');
      } else {
        // Handle unexpected responses
        setError('Incorrect email or password');
      }
    } catch (error) {
      // Handle API errors (e.g., network issues or invalid credentials)
      if (error.response && error.response.status === 401) {
        setError('Incorrect email or password');
      } else if (error.response && error.response.status === 404) {
        setError('User not found');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Login error:', error);
    }
  };

  // Handle email input change
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError(''); // Clear error message when the user types
  };

  // Handle password input change
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError(''); // Clear error message when the user types
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg h-[500px] flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-6">Sign In</h2>
          <p className="text-sm text-gray-600 text-center mb-8">
            Sign in and manage college activities hassle-free
          </p>

          {/* Display error message if login fails */}
          {error && (
            <div className="mb-4 text-center text-red-600">
              {error}
            </div>
          )}

          <form className="flex flex-col space-y-6" onSubmit={handleSignIn}>
            {/* Email Input */}
            <div className="mb-0">
              <input
                type="email"
                placeholder="Enter college email"
                onChange={handleEmailChange}
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-0">
              <input
                type="password"
                placeholder="Password"
                onChange={handlePasswordChange}
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full p-3 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;