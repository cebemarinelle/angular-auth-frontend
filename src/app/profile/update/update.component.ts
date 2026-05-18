import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService, AlertService } from '../../_services';
import { MustMatch } from '../../_helpers';

@Component({
  selector: 'app-profile-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  form!: FormGroup;
  submitting = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    const account = this.accountService.accountValue!;
    
    this.form = this.formBuilder.group({
      title: [account.title, Validators.required],
      firstName: [account.firstName, Validators.required],
      lastName: [account.lastName, Validators.required],
      email: [account.email, [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();

    if (this.form.invalid) return;

    this.submitting = true;
    const updateData = { ...this.form.value };
    
    if (!updateData.password) {
      delete updateData.password;
      delete updateData.confirmPassword;
    }

    this.accountService.update(this.accountService.accountValue!.id!, updateData)
      .subscribe({
        next: () => {
          this.alertService.success('Profile updated successfully');
          this.router.navigate(['/profile']);
        },
        error: (error: any) => {
          this.alertService.error(error);
          this.submitting = false;
        }
      });
  }
}