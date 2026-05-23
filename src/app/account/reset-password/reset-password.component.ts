import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountService, AlertService } from '../../_services';
import { MustMatch } from '../../_helpers';

enum TokenStatus {
  Validating,
  Valid,
  Invalid
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  TokenStatus = TokenStatus;
  tokenStatus = TokenStatus.Validating;
  token: string | null = null;
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    // Method 1: Try to get token from query params
    let token = this.route.snapshot.queryParamMap.get('token');
    
    // Method 2: If not found, try from queryParams object
    if (!token) {
      token = this.route.snapshot.queryParams['token'];
    }
    
    // Method 3: If still not found, get from window.location
    if (!token) {
      const urlParams = new URLSearchParams(window.location.search);
      token = urlParams.get('token');
    }
    
    console.log('🔍 Token found:', token ? token.substring(0, 20) + '...' : 'null');
    console.log('📍 Full URL:', window.location.href);
    
    if (!token) {
      console.error('❌ No token found in URL');
      this.tokenStatus = TokenStatus.Invalid;
      return;
    }
    
    this.token = token;
    
    // Create form
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
    
    // Validate token with backend
    console.log('📡 Sending validation request for token...');
    this.accountService.validateResetToken(this.token).subscribe({
      next: (response) => {
        console.log('✅ Token validation response:', response);
        this.tokenStatus = TokenStatus.Valid;
      },
      error: (error) => {
        console.error('❌ Token validation error:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.error?.message);
        this.tokenStatus = TokenStatus.Invalid;
      }
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();

    if (this.form.invalid) return;

    this.loading = true;
    console.log('📡 Sending reset password request...');
    
    this.accountService.resetPassword(this.token!, this.f['password'].value, this.f['confirmPassword'].value)
      .subscribe({
        next: () => {
          console.log('✅ Password reset successful');
          this.alertService.success('Password reset successful, you can now login');
          setTimeout(() => {
            this.router.navigate(['/account/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('❌ Reset error:', error);
          this.alertService.error(error.error?.message || 'Failed to reset password');
          this.loading = false;
        }
      });
  }
}