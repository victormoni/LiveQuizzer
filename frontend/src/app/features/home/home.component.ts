import { Component } from '@angular/core';
import { AuthService } from '../../../../src/app/core/services/auth.service';
import { User } from '@angular/fire/auth';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule],
})
export class HomeComponent {
  user: User | null = null;

  constructor(private auth: AuthService) {
    // Se já estiver logado (exemplo, recarregando), pega o user atual
    this.user = this.auth.getCurrentUser();
  }

  loginWithGoogle() {
    this.auth.loginWithGoogle().subscribe((user) => {
      this.user = user;
      // Redirecione para dashboard/quiz se quiser
    });
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.user = null;
    });
  }
}
