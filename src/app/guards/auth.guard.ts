import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirebaseApp } from '@angular/fire/app';

@Injectable({
  providedIn: 'root'
})
export class AuthCheck implements CanActivate {
  constructor(private firebaseApp: FirebaseApp, private router: Router, private zone: NgZone) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve) => {
      const auth = getAuth(this.firebaseApp);
      onAuthStateChanged(auth, (user) => {
        const url = state.url;
        if(url === '/login') {
          if(user) {
            this.zone.run(() => {
              this.router.navigate(['/profile']);
            });
            resolve(false);
          } else {
            resolve(true);
          }
        } else {
          if(user) {
            resolve(true);
          } else {
            this.zone.run(() => {
              this.router.navigate(['/login']);
            });
            resolve(false);
          }
        }
      });
    });
  }
}
