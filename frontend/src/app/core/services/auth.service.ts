// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth) {}

  loginWithGoogle(): Observable<User> {
    return from(
      signInWithPopup(this.auth, new GoogleAuthProvider()).then((r) => r.user)
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  isLoggedIn(): Observable<boolean> {
    return new Observable((sub) => {
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
        sub.next(!!user);
      });
      return { unsubscribe };
    });
  }

  getUser(): Observable<User | null> {
    return new Observable<User | null>((sub) => {
      const unsubscribe = this.auth.onAuthStateChanged((user) =>
        sub.next(user)
      );
      return { unsubscribe };
    });
  }

  /** Retorna o usuário logado (ou null) */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}
