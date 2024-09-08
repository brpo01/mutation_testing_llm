import { Component } from '@angular/core';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
})
export class DocumentsComponent {
  constructor(private researchService: ProjectService) {
    this.researchService.clearSelectedProject();
  }
}
