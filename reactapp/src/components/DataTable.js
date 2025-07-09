import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TableSortLabel, TextField, MenuItem, Select, FormControl, InputLabel, Box, Pagination, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import './styles.css';

function DataTable() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fix for TS errors in JS file: explicitly disable type checking for this file
  // @ts-nocheck
  
  // Fix for TS errors in JS file: explicitly disable type checking for this file
  // @ts-nocheck

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [currentEmployee, setCurrentEmployee] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    department: '',
    position: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
        const response = await axios.get('https://9003.vs.amypo.com/api/employees');
      if (response.status === 200) {
        setEmployees(response.data || []);
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

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const filteredEmployees = employees.filter(employee => {
    const emp = employee || {};
    return (
      (filterName === '' || (emp.name && emp.name.toLowerCase().includes(filterName.toLowerCase()))) &&
      (filterDepartment === '' || (emp.department && emp.department.toLowerCase() === filterDepartment.toLowerCase())) &&
      (filterPosition === '' || (emp.position && emp.position.toLowerCase() === filterPosition.toLowerCase()))
    );
  });

  const sortedEmployees = filteredEmployees.sort((a, b) => {
    const empA = a || {};
    const empB = b || {};
    if (orderBy === 'name') {
      return order === 'asc' ? (empA.name || '').localeCompare(empB.name || '') : (empB.name || '').localeCompare(empA.name || '');
    } else if (orderBy === 'email') {
      return order === 'asc' ? (empA.email || '').localeCompare(empB.email || '') : (empB.email || '').localeCompare(empA.email || '');
    } else if (orderBy === 'phone') {
      return order === 'asc' ? (empA.phone || '').localeCompare(empB.phone || '') : (empB.phone || '').localeCompare(empA.phone || '');
    } else if (orderBy === 'department') {
      return order === 'asc' ? (empA.department || '').localeCompare(empB.department || '') : (empB.department || '').localeCompare(empA.department || '');
    } else if (orderBy === 'position') {
      return order === 'asc' ? (empA.position || '').localeCompare(empB.position || '') : (empB.position || '').localeCompare(empA.position || '');
    }
    return 0;
  });

  const paginatedEmployees = sortedEmployees.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const uniqueDepartments = [...new Set(employees.map(emp => (emp && typeof emp.department === 'string' ? emp.department : '')).filter(dept => dept))];
  const uniquePositions = [...new Set(employees.map(emp => (emp && typeof emp.position === 'string' ? emp.position : '')).filter(pos => pos))];

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setCurrentEmployee({
      id: null,
      name: '',
      email: '',
      phone: '',
      department: '',
      position: ''
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (employee) => {
    setDialogMode('edit');
    setCurrentEmployee(employee);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEmployee = async () => {
    try {
      if (dialogMode === 'add') {
        const response = await axios.post('https://9003.vs.amypo.com/api/employees', currentEmployee);
        if (response.status === 201) {
          setEmployees(prev => [...prev, response.data]);
          setError('');
        }
      } else if (dialogMode === 'edit') {
        const response = await axios.put(`https://9003.vs.amypo.com/api/employees/${currentEmployee.id}`, currentEmployee);
        if (response.status === 200) {
          setEmployees(prev => prev.map(emp => (emp.id === currentEmployee.id ? response.data : emp)));
          setError('');
        }
      }
      setOpenDialog(false);
    } catch (error) {
      let detailedError = 'Failed to save employee data. Please try again.';
      if (error.response) {
        detailedError += ` Server responded with status ${error.response.status}: ${error.response.data?.error || 'Unknown error'}`;
      } else if (error.request) {
        detailedError += ' No response received from server. Please check if the server is running.';
      } else {
        detailedError += ` Error: ${error.message}`;
      }
      setError(detailedError);
      console.error('Error saving data:', error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const response = await axios.post(`https://9003.vs.amypo.com/api/employees/${id}/deactivate`);
      if (response.status === 200) {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
        setError('');
      }
    } catch (error) {
      let detailedError = 'Failed to delete employee data. Please try again.';
      if (error.response) {
        detailedError += ` Server responded with status ${error.response.status}: ${error.response.data?.error || 'Unknown error'}`;
      } else if (error.request) {
        detailedError += ' No response received from server. Please check if the server is running.';
      } else {
        detailedError += ` Error: ${error.message}`;
      }
      setError(detailedError);
      console.error('Error deleting data:', error);
    }
  };

  return (
    <div className="container">
      <Typography variant="h5" gutterBottom>
        Employee Data Table
      </Typography>
      {error && <div className="error-message">{error}</div>}
      <Button variant="contained" color="primary" onClick={handleOpenAddDialog} sx={{ marginBottom: 2 }}>
        Add Employee
      </Button>
      {employees.length > 0 ? (
        <>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Filter by Name"
              variant="outlined"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              sx={{ flexGrow: 1, minWidth: '200px' }}
            />
            <FormControl sx={{ minWidth: '200px' }}>
              <InputLabel>Filter by Department</InputLabel>
              <Select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                label="Filter by Department"
              >
                <MenuItem value="">All</MenuItem>
                {uniqueDepartments.map(dept => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: '200px' }}>
              <InputLabel>Filter by Position</InputLabel>
              <Select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                label="Filter by Position"
              >
                <MenuItem value="">All</MenuItem>
                {uniquePositions.map(pos => (
                  <MenuItem key={pos} value={pos}>{pos}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? (order === 'asc' ? 'asc' : 'desc') : 'asc'}
                      onClick={() => handleRequestSort('name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'email'}
                      direction={orderBy === 'email' ? (order === 'asc' ? 'asc' : 'desc') : 'asc'}
                      onClick={() => handleRequestSort('email')}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'phone'}
                      direction={orderBy === 'phone' ? (order === 'asc' ? 'asc' : 'desc') : 'asc'}
                      onClick={() => handleRequestSort('phone')}
                    >
                      Phone
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'department'}
                      direction={orderBy === 'department' ? (order === 'asc' ? 'asc' : 'desc') : 'asc'}
                      onClick={() => handleRequestSort('department')}
                    >
                      Department
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'position'}
                      direction={orderBy === 'position' ? (order === 'asc' ? 'asc' : 'desc') : 'asc'}
                      onClick={() => handleRequestSort('position')}
                    >
                      Position
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEmployees.map((employee, index) => (
                  <TableRow key={index}>
                    <TableCell>{employee.name || 'N/A'}</TableCell>
                    <TableCell>{employee.email || 'N/A'}</TableCell>
                    <TableCell>{employee.phone || 'N/A'}</TableCell>
                    <TableCell>{employee.department || 'N/A'}</TableCell>
                    <TableCell>{employee.position || 'N/A'}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="primary" size="small" onClick={() => handleOpenEditDialog(employee)} sx={{ marginRight: 1 }}>
                        Edit
                      </Button>
                      <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteEmployee(employee.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
            <Pagination
              count={Math.ceil(filteredEmployees.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
            <FormControl sx={{ minWidth: '100px' }}>
              <InputLabel>Rows per page</InputLabel>
              <Select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                label="Rows per page"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>{dialogMode === 'add' ? 'Add Employee' : 'Edit Employee'}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                name="name"
                value={currentEmployee.name}
                onChange={handleInputChange}
                fullWidth
                variant="standard"
              />
              <TextField
                margin="dense"
                label="Email"
                name="email"
                value={currentEmployee.email}
                onChange={handleInputChange}
                fullWidth
                variant="standard"
              />
              <TextField
                margin="dense"
                label="Phone"
                name="phone"
                value={currentEmployee.phone}
                onChange={handleInputChange}
                fullWidth
                variant="standard"
              />
              <TextField
                margin="dense"
                label="Department"
                name="department"
                value={currentEmployee.department}
                onChange={handleInputChange}
                fullWidth
                variant="standard"
              />
              <TextField
                margin="dense"
                label="Position"
                name="position"
                value={currentEmployee.position}
                onChange={handleInputChange}
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleSaveEmployee} variant="contained" color="primary">
                {dialogMode === 'add' ? 'Add' : 'Save'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Typography variant="body1">No employee data available.</Typography>
      )}
    </div>
  );
}

export default DataTable;
