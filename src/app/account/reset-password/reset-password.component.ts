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
  token?: string;
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
    // ✅ FIX: Try multiple ways to get the token
    let token = this.route.snapshot.queryParamMap.get('token');
    
    // If not found, try the old way
    if (!token) {
      token = this.route.snapshot.queryParams['token'];
    }
    
    // If still not found, try from window.location
    if (!token) {
      const urlParams = new URLSearchParams(window.location.search);
      token = urlParams.get('token');
    }
    
    console.log('🔍 Token from URL:', token);
    console.log('📍 Full URL:', window.location.href);
    
    // Remove token from URL to keep it clean (but after we capture it)
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

    if (!token) {
      console.error('❌ No token found in URL');
      this.tokenStatus = TokenStatus.Invalid;
      return;
    }

    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    // ✅ FIX: Add better error handling for token validation
    this.accountService.validateResetToken(token)
      .subscribe({
        next: (response) => {
          console.log('✅ Token validation response:', response);
          this.token = token;
          this.tokenStatus = TokenStatus.Valid;
        },
        error: (error) => {
          console.error('❌ Token validation error:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.error?.message);
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
    this.accountService.resetPassword(this.token!, this.f['password'].value, this.f['confirmPassword'].value)
      .subscribe({
        next: () => {
          this.alertService.success('Password reset successful, you can now login', { keepAfterRouteChange: true });
          this.router.navigate(['/account/login']);
        },
        error: (error: any) => {
          console.error('Reset error:', error);
          this.alertService.error(error.error?.message || 'Failed to reset password');
          this.loading = false;
        }
      });
  }
}