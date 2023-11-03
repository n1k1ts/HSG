import { Component } from '@angular/core';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HSG Bullion';
  private roles: string[] = [];
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  get isLoggedIn() {
    return this.storageService.isLoggedIn();
  }

  constructor(private storageService: StorageService, private authService: AuthService) { }

  ngOnInit(): void {
    if (this.isLoggedIn) {
      const currentUser = this.storageService.getUser();
      this.roles = currentUser.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = currentUser.username;
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();

        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
