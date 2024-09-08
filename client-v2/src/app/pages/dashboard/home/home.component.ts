import { Component, ViewChild } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EditComponent } from '../../../modals/edit/edit.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EmptyComponent } from '../../../components/empty/empty.component';
import { CreateReviewComponent } from '../../../modals/create-review/create-review.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NzIconModule,
    EditComponent,
    NzModalModule,
    EmptyComponent,
    CreateReviewComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @ViewChild(EditComponent, { static: false }) editModal!: EditComponent;
  @ViewChild(CreateReviewComponent, { static: false })
  createModal!: CreateReviewComponent;
  isVisible = false;
  projects: Array<any> = [];
  projectID = '';
  constructor(
    private projectService: ProjectService,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private router: Router
  ) {
    this.getAllProject();
    this.projectService.clearSelectedProject();
  }

  selectProjectForEdit(project: any): void {
    this.projectService.setSelectedProject(project);
    this.showEditModal();
  }

  selectProject(project: any): void {
    this.projectService.setSelectedProject(project);
  }

  showEditModal(): void {
    this.editModal.showModal();
  }
  getAllProject() {
    this.projectService.getAllProject().subscribe({
      next: (res: any) => {
        this.projects = res.data;
      },
    });
  }

  showDeleteConfirm(projectID: any): void {
    this.projectID = projectID;
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this project ?',
      nzOkText: 'Delete',
      nzOkDanger: true,
      nzOnOk: () => {
        this.projectService.deleteProject(this.projectID).subscribe({
          next: (res: any) => {
            this.notification.create(
              'success',
              'Success',
              'Project was successfully deleted'
            );
            this.getAllProject();
          },
        });
      },
      nzCancelText: 'Cancel',
    });
  }

  showCreateReviewModal() {
    this.createModal.showModal();
  }
}
