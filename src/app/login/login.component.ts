import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { Router } from '@angular/router';
import { FirebaseApp } from '@angular/fire/app';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private firebaseApp: FirebaseApp,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const auth = getAuth(this.firebaseApp);
      const { email, password } = this.loginForm.value;
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          this.setUserCookie(result.user);
          this.zone.run(() => {
            this.router.navigate(['/profile']);
          });
        })
        .catch((error) => {
          if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
            // User does not exist; sign them up
            createUserWithEmailAndPassword(auth, email, password)
              .then((result) => {
                this.setUserCookie(result.user);
                this.zone.run(() => {
                  this.router.navigate(['/profile']);
                });
              })
              .catch((createError) => {
                console.error('Error during account creation:', createError);
              });
          } else {
            console.error('Error during sign in:', error);
          }
        });
      console.log('Login submitted:', this.loginForm.value);
    }
  }

  onGoogleLogin() {
    const auth = getAuth(this.firebaseApp);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        this.setUserCookie(result.user);
        this.zone.run(() => {
          this.router.navigate(['/profile']);
        });
      })
      .catch((error) => {
        console.error('Google login error:', error);
      });
  }

  private setUserCookie(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      document.cookie = 'user=' + encodeURIComponent(JSON.stringify(user)) + '; path=/; max-age=3600; SameSite=Strict';
      console.log('User cookie set', user);
    }
  }
}
