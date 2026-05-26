import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../_services';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  totalUsers = 0;
  adminCount = 0;
  userCount = 0;
  recentUsers: any[] = [];
  isLoading = true;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.accountService.getAll().subscribe({
      next: (users: any[]) => {
        this.totalUsers = users.length;
        this.adminCount = users.filter(u => u.role === 'Admin').length;
        this.userCount = users.filter(u => u.role === 'User').length;
        this.recentUsers = users.slice(-5).reverse();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load users:', error);
        this.isLoading = false;
      }
    });
  }
}