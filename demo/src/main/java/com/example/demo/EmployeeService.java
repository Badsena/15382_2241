package com.example.demo;

import com.example.demo.Employee;
import com.example.demo.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findByStatus("active");
    }

    public Employee updateEmployee(Long id, Employee employee) {
        return employeeRepository.findById(id).map(existingEmployee -> {
            existingEmployee.setName(employee.getName());
            existingEmployee.setEmail(employee.getEmail());
            existingEmployee.setPhone(employee.getPhone());
            existingEmployee.setDepartment(employee.getDepartment());
            existingEmployee.setPosition(employee.getPosition());
            return employeeRepository.save(existingEmployee);
        }).orElse(null);
    }

    public boolean deleteEmployee(Long id) {
        return employeeRepository.findById(id).map(employee -> {
            employee.setStatus("inactive");
            employeeRepository.save(employee);
            return true;
        }).orElse(false);
    }
}
