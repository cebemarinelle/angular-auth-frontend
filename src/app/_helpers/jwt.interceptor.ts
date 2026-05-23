import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../_services';
import { environment } from '../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const account = this.accountService.accountValue;
    const isLoggedIn = account && account.jwtToken;
    // Fix: Check if the request URL includes the API URL or starts with /accounts
    const isApiUrl = request.url.startsWith('/accounts') || request.url.includes(environment.apiUrl);
    
    console.log('JWT Interceptor - URL:', request.url);
    console.log('isApiUrl:', isApiUrl);
    console.log('isLoggedIn:', isLoggedIn);
    
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${account.jwtToken}` }
      });
      console.log('✅ Added Authorization header');
    } else {
      console.log('❌ No token added');
    }
    
    return next.handle(request);
  }
}