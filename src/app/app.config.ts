import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyA77JzFplsSSg7gLX2EAmSjFRYDDP582l4",
  authDomain: "login-app-e894c.firebaseapp.com",
  projectId: "login-app-e894c",
  storageBucket: "login-app-e894c.firebasestorage.app",
  messagingSenderId: "474733512398",
  appId: "1:474733512398:web:3633732f86b0f6be4ff29f",
  measurementId: "G-TN6RCLRCHC"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth())
  ]
};