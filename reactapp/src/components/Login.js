import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    let tempErrors = { username: '', password: '' };
    if (!username) tempErrors.username = 'Username is required';
    if (!password) tempErrors.password = 'Password is required';
    
    setErrors(tempErrors);
    if (Object.values(tempErrors).some(error => error !== '')) {
      setErrorMessage('Please correct the errors in the form.');
      setLoading(false);
      return;
    }
      try {
        let response;
        try {
        //   response = await axios.post('http://localhost:8080/api/auth/login', {
        //     username,
        //     password
        //   });
        //   console.log('Response from server:', response);
        //   if (response && response.data && response.data.message === 'Login successful') {
        //     setSuccessMessage('Login successful!');
        //     setErrorMessage('');
        //     console.log('Login successful:', response.data);
        //     setTimeout(() => {
        //       navigate('/dashboard');
        //     }, 2000); // Delay navigation to show the success message
        //   }
        } catch (err) {
          console.error('Error during login request:', err);
          throw err; // Re-throw to handle in the outer catch block
        }
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'An error occurred during login';
        setErrorMessage(errorMsg);
        setSuccessMessage('');
        console.error('Login error:', err);
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-label="username"
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="password"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
