import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { Employee } from '../../shared/models/employee.model';

@Component({
  selector: 'app-employee-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-search.component.html',
  styleUrls: ['./employee-search.component.css']
})
export class EmployeeSearchComponent {
  designation: string = '';
  department: string = '';
  employees: Employee[] = [];
  errorMessage: string = '';
  isLoading = false;

  constructor(private employeeService: EmployeeService) {}

  onSearch(): void {
    this.isLoading = true;
    this.employeeService
      .searchEmployees(this.designation.trim(), this.department.trim())
      .subscribe({
        next: (data) => {
          this.employees = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to search employees.';
          this.isLoading = false;
        }
      });
  }

  onClear(): void {
    this.designation = '';
    this.department = '';
    this.employees = [];
    this.errorMessage = '';
  }
}
