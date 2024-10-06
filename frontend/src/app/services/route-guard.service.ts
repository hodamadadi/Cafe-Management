// import { error } from 'console';
// import { Injectable } from '@angular/core';
// import { AuthService } from './auth.service';
// import { ActivatedRouteSnapshot, Router } from '@angular/router';
// import { SnackbarService } from './snackbar.service';
// import { jwtDecode } from 'jwt-decode';

// import { GlobalConstants } from '../shared/global-constants';

// @Injectable({
//   providedIn: 'root',
// })
// export class RouteGuardService {
//   constructor(
//     public auth: AuthService,
//     public router: Router,
//     private snackbarService: SnackbarService
//   ) {}

//   canActivate(route: ActivatedRouteSnapshot): boolean {
//     let expectedRoleArray = route.data;
//     expectedRoleArray = expectedRoleArray.expectedRole;

//     const token: any = localStorage.getItem('token');
//     var tokenPayload: any;
//     try {
//       tokenPayload = jwtDecode(token);
//     } catch (error) {
//       localStorage.clear();
//       this.router.navigate(['/']);
//     }
//     let checkRole = false;

//     for (let i = 0; i < expectedRoleArray.length; i++) {
//       if (expectedRoleArray[i] == tokenPayload.role) {
//         checkRole = true;
//       }
//     }
//     if (tokenPayload.role == 'user' || tokenPayload.role == 'admin') {
//       if (this.auth.isAuthenticated() && checkRole) {
//         return true;
//       }
//       this.snackbarService.openSnackBar(
//         GlobalConstants.unauthorized,
//         GlobalConstants.error
//       );
//       this.router.navigate(['/cafe/dashboard']);
//       return false;
//     } else {
//       this.router.navigate(['/']);
//       localStorage.clear();
//       return false;
//     }
//   }
// }
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { jwtDecode } from 'jwt-decode';
import { GlobalConstants } from '../shared/global-constants';

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService {
  constructor(
    public auth: AuthService,
    public router: Router,
    private snackbarService: SnackbarService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Get the expected roles from route data
    let expectedRoleArray = route.data.expectedRole || [];

    // Retrieve the token from local storage
    const token: any = localStorage.getItem('token');
    let tokenPayload: any;

    // Decode the JWT token
    try {
      tokenPayload = jwtDecode(token);
    } catch (error) {
      // Clear local storage and navigate to the home page on error
      localStorage.clear();
      this.router.navigate(['/']);
      return false;
    }

    // Check if the user's role matches the expected roles
    let checkRole = expectedRoleArray.includes(tokenPayload.role);

    // Check if user is authenticated and has the required role
    if (this.auth.isAuthenticated() && checkRole) {
      return true;
    } else {
      // Show an unauthorized message and navigate away
      this.snackbarService.openSnackBar(
        GlobalConstants.unauthorized,
        GlobalConstants.error
      );
      this.router.navigate(['/cafe/dashboard']); // Adjust this route if needed
      return false;
    }
  }
}

