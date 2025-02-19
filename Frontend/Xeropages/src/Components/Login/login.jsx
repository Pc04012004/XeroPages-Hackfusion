
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  // Handle the sign-in action and redirect to home page
  function handleSignIn(event) {
    event.preventDefault();

    const userData = {
        email,
        password,
      };

    console.log(userData);
     

    navigate('/home');
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg h-[500px] flex flex-col justify-center"> 
          
          
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-6">Sign In</h2>
          <p className="text-sm text-gray-600 text-center mb-8">
            Sign in and manage college activities hassle-free
          </p>
          
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
