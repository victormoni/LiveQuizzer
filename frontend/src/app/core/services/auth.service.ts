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
      signInWithPopup(this.auth, new GoogleAuthProvider()).then(
        (result) => result.user
      )
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async getIdToken(): Promise<string | null> {
    return this.auth.currentUser
      ? await this.auth.currentUser.getIdToken()
      : null;
  }
}
