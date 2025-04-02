import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { Employee } from '../../shared/models/employee.model';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css']
})
export class EmployeeAddComponent {
  employee: Omit<Employee, 'id'> = {
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    designation: '',
    salary: 0,
    date_of_joining: '',
    department: '',
    employee_photo: ''
  };

  errorMessage: string = '';

  constructor(private employeeService: EmployeeService, private router: Router) {}

  onSubmit() {
    // Validate
    if (
      !this.employee.first_name ||
      !this.employee.last_name ||
      !this.employee.email ||
      !this.employee.gender ||
      !this.employee.designation ||
      !this.employee.salary ||
      !this.employee.date_of_joining ||
      !this.employee.department
    ) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    // Submit
    this.employeeService.addEmployee({ ...this.employee, id: '' }).subscribe({
      next: () => this.router.navigate(['/employees']),
      error: (error) => {
        console.error('Error adding employee:', error);
        this.errorMessage = error.message || 'Failed to add employee';
      }
    });
  }
}
