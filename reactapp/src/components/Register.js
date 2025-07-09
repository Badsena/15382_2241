import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    let tempErrors = { username: '', email: '', password: '', confirmPassword: '' };
    if (!username) tempErrors.username = 'Username is required';
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Email is invalid';
    }
    if (!password) tempErrors.password = 'Password is required';
    if (password !== confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(tempErrors);
    if (Object.values(tempErrors).some(error => error !== '')) {
      setErrorMessage('Please correct the errors in the form.');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post('https://9003.vs.amypo.com/api/auth/register', {
      // const response = await axios.post('http://localhost:9000/api/auth/register', {
        username,
        email,
        password
      });
      if (response.data.message === 'Registration successful') {
        setSuccessMessage('Registration successful! You can now login.');
        setErrorMessage('');
        console.log('Registration successful:', response.data);
        // Redirect to login or show success message
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'An error occurred during registration';
      setErrorMessage(errorMsg);
      setSuccessMessage('');
      console.error('Registration error:', err);
      console.error('Full error details:', JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
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
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            data-testid="password-input"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            data-testid="confirm-password-input"
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Register;
