import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AccountService, AlertService } from '../../_services';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private router: Router
  ) {}

  get account() {
    return this.accountService.accountValue;
  }

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
      this.accountService.delete(this.account!.id!).subscribe({
        next: () => {
          this.alertService.success('Account deleted successfully');
          this.router.navigate(['/account/login']);
        },
        error: (error: any) => {
          this.alertService.error(error);
        }
      });
    }
  }
}