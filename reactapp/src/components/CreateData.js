import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

function CreateData() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: ''
  });
  const [errors, setErrors] = useState({ name: '', email: '', phone: '', department: '', position: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = 'Name is required';
    if (!formData.email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email is invalid';
    }
    if (!formData.phone) {
      tempErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      tempErrors.phone = 'Phone number must be exactly 10 digits';
    }
    if (!formData.department) tempErrors.department = 'Department is required';
    if (!formData.position) tempErrors.position = 'Position is required';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('https://9003.vs.amypo.com/api/employees', formData);
        if (response.status === 201) {
          setSuccessMessage('Employee data saved successfully!');
          setErrorMessage('');
          setFormData({
            name: '',
            email: '',
            phone: '',
            department: '',
            position: ''
          });
          setErrors({ name: '', email: '', phone: '', department: '', position: '' });
        }
      } catch (error) {
        let detailedError = 'Failed to save employee data. Please try again.';
        if (error.response) {
          detailedError += ` Server responded with status ${error.response.status}: ${error.response.data?.error || 'Unknown error'}`;
        } else if (error.request) {
          detailedError += ' No response received from server. Please check if the server is running.';
        } else {
          detailedError += ` Error: ${error.message}`;
        }
        setErrorMessage(detailedError);
        setSuccessMessage('');
        console.error('Error saving data:', error);
      }
    } else {
      setErrorMessage('Please correct the errors in the form.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="container">
      <h2>Create Employee Data</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <input
            id="department"
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
          {errors.department && <span className="error">{errors.department}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="position">Position:</label>
          <input
            id="position"
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          />
          {errors.position && <span className="error">{errors.position}</span>}
        </div>
        <button type="submit">Save Employee</button>
      </form>
    </div>
  );
}

export default CreateData;
