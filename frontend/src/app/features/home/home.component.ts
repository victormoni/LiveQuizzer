import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../src/app/core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, RouterModule],
})
export class HomeComponent implements OnInit {
  loggedIn = false;
  userName: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.isLoggedIn().subscribe((logged) => {
      this.loggedIn = logged;
      // if (logged) this.router.navigate(['/quiz']);
    });

    this.auth.getUser().subscribe((user) => {
      this.userName = user?.displayName ?? null;
    });
  }

  loginWithGoogle() {
    this.auth.loginWithGoogle().subscribe(() => {
      // depois que logar, leva para /quiz
      this.router.navigate(['/quiz']);
    });
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.loggedIn = false;
      // Opcional: redireciona para home após logout
      this.router.navigate(['/']);
    });
  }
}
