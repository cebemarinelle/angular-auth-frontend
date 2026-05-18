import { AccountService } from '../_services';

export function appInitializer(accountService: AccountService) {
  return () => accountService.refreshToken().toPromise().catch(() => {});
}