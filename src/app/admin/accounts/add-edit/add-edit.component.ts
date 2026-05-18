import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountService, AlertService } from '../../../_services';
import { MustMatch } from '../../../_helpers';

@Component({
  selector: 'app-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  id!: string;
  isAddMode = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.minLength(6), ...(!this.isAddMode ? [] : [Validators.required])]],
      confirmPassword: ['']
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    if (!this.isAddMode) {
      this.loading = true;
      this.accountService.getById(this.id).subscribe({
        next: (data) => {
          this.form.patchValue(data);
          this.loading = false;
        },
        error: (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
    }
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;
    const accountData = { ...this.form.value };
    if (!accountData.password) delete accountData.password;

    if (this.isAddMode) {
      this.accountService.create(accountData).subscribe({
        next: () => {
          this.alertService.success('Account created');
          this.router.navigate(['/admin/accounts']);
        },
        error: (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
    } else {
      this.accountService.update(this.id, accountData).subscribe({
        next: () => {
          this.alertService.success('Account updated');
          this.router.navigate(['/admin/accounts']);
        },
        error: (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
    }
  }
}