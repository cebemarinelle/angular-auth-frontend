import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService, AlertService } from '../../../_services';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  accounts: any[] = [];
  loading = true;

  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.loading = true;
    this.cdr.detectChanges();
    console.log('Loading accounts...');
    
    this.accountService.getAll().subscribe({
      next: (data) => {
        console.log('Accounts loaded:', data);
        this.accounts = data;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Loading set to false, accounts count:', this.accounts.length);
      },
      error: (error) => {
        console.error('Failed to load accounts:', error);
        this.alertService.error(error.error?.message || 'Failed to load accounts');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteAccount(id: string) {
    if (confirm('Are you sure you want to delete this account?')) {
      this.accountService.delete(id).subscribe({
        next: () => {
          this.accounts = this.accounts.filter(x => x.id !== id);
          this.alertService.success('Account deleted successfully');
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Delete failed:', error);
          this.alertService.error(error.error?.message || 'Failed to delete account');
        }
      });
    }
  }
}