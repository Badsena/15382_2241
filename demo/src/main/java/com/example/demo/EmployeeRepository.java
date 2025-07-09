package com.example.demo;

import com.example.demo.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    java.util.List<Employee> findByStatus(String status);
}
