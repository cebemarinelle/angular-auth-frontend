import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private router: Router,
    private accountService: AccountService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const account = this.accountService.accountValue;
    if (account) {
      const roles = route.data['roles'] as Array<string>;
      if (roles && !roles.includes(account.role!)) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}