import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private alertService: AlertService,
    private cdr: ChangeDetectorRef  // <-- ADD THIS
  ) {}

  ngOnInit() {
    // --- Get the token from the URL ---
    let token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      token = this.route.snapshot.queryParams['token'];
    }
    if (!token) {
      const urlParams = new URLSearchParams(window.location.search);
      token = urlParams.get('token');
    }
    
    console.log('🔍 Token found:', token ? token.substring(0, 20) + '...' : 'null');
    
    if (!token) {
      this.tokenStatus = TokenStatus.Invalid;
      this.cdr.detectChanges(); // Force UI update
      return;
    }
    
    this.token = token;
    
    // --- Create the form (it's ready to go once the token is valid) ---
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
    
    // --- Validate the token with the backend ---
    this.accountService.validateResetToken(this.token).subscribe({
      next: (response) => {
        console.log('✅ Token validation response:', response);
        // THIS IS THE KEY FIX: Change the status AND tell Angular to refresh the view
        this.tokenStatus = TokenStatus.Valid;
        this.cdr.detectChanges(); // <-- FORCE UI UPDATE
        console.log('TokenStatus changed to Valid');
      },
      error: (error) => {
        console.error('❌ Token validation error:', error);
        this.tokenStatus = TokenStatus.Invalid;
        this.cdr.detectChanges(); // Force UI update for error state
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
          this.alertService.success('Password reset successful, you can now login');
          setTimeout(() => {
            this.router.navigate(['/account/login']);
          }, 2000);
        },
        error: (error) => {
          this.alertService.error(error.error?.message || 'Failed to reset password');
          this.loading = false;
        }
      });
  }
}