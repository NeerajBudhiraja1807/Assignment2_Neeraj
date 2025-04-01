import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (result: any) => {
          // Check if the response contains the token and store it
          if (result?.data?.login) {
            const token = result.data.login;
            if (token) {
              localStorage.setItem('token', token);
              console.log('Login successful, token stored.');
              this.router.navigate(['/employees']);
            } else {
              this.errorMessage = 'Token not found in the response';
              console.error('Error: Token not found in the response');
            }
          } else {
            this.errorMessage = 'Invalid response from server';
            console.error('Error: Invalid response structure');
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = error?.message || 'Login failed. Please try again.';
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'Please enter valid email and password.';
    }
  }
}
