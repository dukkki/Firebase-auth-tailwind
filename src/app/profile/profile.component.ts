import { Component, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { getAuth, signOut } from 'firebase/auth';
import { Router } from '@angular/router';
import { FirebaseApp } from '@angular/fire/app';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  userEmail: string;
  photoURL: string;
  displayName: string;
  activeTab: string = 'menu1';
  defaultPhotoURL: string = 'assets/profile.png'
  items: any[] = [
    { name: 'Iphone', price: 1000, image: 'assets/ip.png' },
    { name: 'Iphone', price: 1000, image: 'assets/ip.png' },
    { name: 'Iphone', price: 1000, image: 'assets/ip.png' },
    { name: 'Iphone', price: 1000, image: 'assets/ip.png' },
    { name: 'Iphone', price: 1000, image: 'assets/ip.png' },
    { name: 'Iphone', price: 1000, image: 'assets/ip.png' },
  ];

  constructor(
    private router: Router,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
    private firebaseApp: FirebaseApp
  ) {
    if (isPlatformBrowser(this.platformId)) {
      console.log(getAuth(this.firebaseApp));
      if (this.firebaseApp && this.firebaseApp.options) {
        try {
          const authUser = getAuth(this.firebaseApp).currentUser;
          console.log(
            '🚀 ~ ProfileComponent ~ constructor ~ authUser:',
            authUser
          );
          if (authUser) {
            this.userEmail = authUser.email || 'Unknown';
            this.photoURL = authUser.photoURL || '';
            this.displayName = authUser.displayName || 'No name';
          } else {
            const storedUserCookie = this.getCookie('user');
            console.log(
              '🚀 ~ ProfileComponent ~ constructor ~ storedUserCookie:',
              storedUserCookie
            );
            if (storedUserCookie) {
              const user = JSON.parse(decodeURIComponent(storedUserCookie));
              this.userEmail = user.email || 'Unknown';
              this.photoURL = user.photoURL || '';
              this.displayName = user.displayName || 'No name';
            } else {
              this.userEmail = 'Unknown';
              this.photoURL = '';
              this.displayName = 'No name';
            }
          }
        } catch (error) {
          console.error(
            'Error initializing Firebase Auth in ProfileComponent:',
            error
          );
          this.userEmail = 'Unknown';
          this.photoURL = '';
          this.displayName = 'No name';
        }
      } else {
        const storedUserCookie = this.getCookie('user');
        if (storedUserCookie) {
          const user = JSON.parse(decodeURIComponent(storedUserCookie));
          this.userEmail = user.email || 'Unknown';
          this.photoURL = user.photoURL || '';
          this.displayName = user.displayName || 'No name';
        } else {
          this.userEmail = 'Unknown';
          this.photoURL = '';
          this.displayName = 'No name';
        }
      }
    } else {
      this.userEmail = 'Unknown';
      this.photoURL = '';
      this.displayName = 'No name';
    }
  }
  getDisplayPhotoURL(): string {
    return this.photoURL === "" ? this.defaultPhotoURL : this.photoURL;
  }

  onSignOut() {
    const auth = getAuth(this.firebaseApp);
    signOut(auth)
      .then(() => {
        if (isPlatformBrowser(this.platformId)) {
          document.cookie = 'user=; path=/; max-age=0; SameSite=Strict';
        }
        this.zone.run(() => {
          this.router.navigate(['/login']);
        });
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
}
