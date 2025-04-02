import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.signup(this.username, this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/employees']); // Redirect after successful signup
      },
      error: (err) => {
        this.errorMessage = err.message || 'Signup failed. Please try again.';
      }
    });
  }
}
