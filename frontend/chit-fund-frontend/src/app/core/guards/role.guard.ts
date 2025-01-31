// import { Injectable } from '@angular/core';
// import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
// import { AuthService } from '../services/auth.service';
// import { map, take } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class RoleGuard implements CanActivate {
//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   canActivate(route: ActivatedRouteSnapshot) {
//     return this.authService.userRole().pipe(
//       take(1),
//       map(role => {
//         const expectedRole = route.data['role'];
//         if (!role || role.toUpperCase() !== expectedRole.toUpperCase()) {
//           this.router.navigate(['/login']);
//           return false;
//         }
//         return true;
//       })
//     );
//   }
// }