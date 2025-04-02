import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../../shared/models/employee.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = true;
  errorMessage: string = '';

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

  editEmployee(id: string) {
    this.router.navigate(['/employees/edit', id]);
  }

  viewDetails(id: string) {
    this.router.navigate(['/employees/detail', id]);
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
}
