import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {

  user: any;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.user = this.auth.getUser();
  }
}
