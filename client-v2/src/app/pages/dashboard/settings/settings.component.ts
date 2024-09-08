import { Component } from '@angular/core';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  constructor(private projectService: ProjectService) {
    this.projectService.clearSelectedProject();
  }
}
