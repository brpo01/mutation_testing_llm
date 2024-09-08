import { Component } from '@angular/core';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  constructor(private projectService: ProjectService) {
    this.projectService.clearSelectedProject();
  }
}
