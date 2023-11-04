import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Import Router
import { UserService } from '../_services/user.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  content?: string;
  [x: string]: any;
  currentUser: any;
  auth: any;

  constructor(private userService: UserService,  private router: Router) { }
  

  ngOnInit(): void {

    
    this.userService.getPublicContent().subscribe({
      next: data => {
        this.content = data;
      },
      error: err => {console.log(err)
        if (err.error) {
          this.content = JSON.parse(err.error).message;
        } else {
          this.content = "Error with status: " + err.status;
        }
      }
    });

    this.router.navigate(['/profile']);
  }
}
