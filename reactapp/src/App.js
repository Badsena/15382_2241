import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateData from './components/CreateData';
import ListData from './components/ListData';
import Reports from './components/Reports';
import DataTable from './components/DataTable';
import DashboardLayout from './components/DashboardLayout';
import Crud from './components/Crud';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="create-data" element={<CreateData />} />
            <Route path="list-data" element={<ListData />} />
            <Route path="reports" element={<Reports />} />
            <Route path="data-table" element={<DataTable />} />
            <Route path="crud" element={<Crud />} /> {/* Changed from /crud to crud */}
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
