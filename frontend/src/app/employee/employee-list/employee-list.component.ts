import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../../shared/models/employee.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = true;
  errorMessage: string = '';

  // 🔍 Search filters
  designation: string = '';
  department: string = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.employeeService.getEmployees().subscribe({
      next: (result) => {
        this.employees = result || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.errorMessage = error.message || 'Failed to load employees.';
        this.loading = false;
      }
    });
  }

  searchEmployees() {
    this.loading = true;
    this.employeeService
      .searchEmployees(this.designation.trim(), this.department.trim())
      .subscribe({
        next: (data) => {
          this.employees = data || [];
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Search failed.';
          this.loading = false;
        }
      });
  }

  clearSearch() {
    this.designation = '';
    this.department = '';
    this.loadEmployees();
  }

  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => this.loadEmployees(),
        error: (error) => {
          console.error('Error deleting employee:', error);
        }
      });
    }
  }

  editEmployee(id: string) {
    this.router.navigate(['/employees/edit', id]);
  }

  viewDetails(id: string) {
    this.router.navigate(['/employees/detail', id]);
  }
}
