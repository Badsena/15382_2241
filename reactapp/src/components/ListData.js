 // @ts-nocheck
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

function ListData() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  
  // Fix for TS errors in JS file: explicitly disable type checking for this file
  // @ts-nocheck

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('https://9003.vs.amypo.com/api/employees');
        if (response.status === 200) {
          setEmployees(response.data);
          setError('');
        }
      } catch (error) {
        let detailedError = 'Failed to fetch employee data. Please try again.';
        if (error.response) {
          detailedError += ` Server responded with status ${error.response.status}: ${error.response.data?.error || 'Unknown error'}`;
        } else if (error.request) {
          detailedError += ' No response received from server. Please check if the server is running.';
        } else {
          detailedError += ` Error: ${error.message}`;
        }
        setError(detailedError);
        console.error('Error fetching data:', error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="container">
      <h2>Employee Data List</h2>
      {error && <div className="error-message">{error}</div>}
      {employees && employees.length > 0 ? (
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={index}>
                <td>{employee.name || 'N/A'}</td>
                <td>{employee.email || 'N/A'}</td>
                <td>{employee.phone || 'N/A'}</td>
                <td>{employee.department || 'N/A'}</td>
                <td>{employee.position || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No employee data available.</p>
      )}
    </div>
  );
}

export default ListData;
