import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { project } from '../../models/project';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-create-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NzModalModule],
  templateUrl: './create-review.component.html',
  styleUrl: './create-review.component.css',
})
export class CreateReviewComponent {
  isVisible = false;
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private projectService: ProjectService,
    private router: Router,
    private userService: UserService
  ) {
    this.form = fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.form.markAllAsTouched();
    this.form.markAsDirty();
    if (!this.form.valid) {
      this.notification.create(
        'error',
        'error',
        'please check fields and try again'
      );
      return;
    }
    let data = new project();
    const user = this.userService.getUser();
    data = { ...data, ...this.form.value, user: user.id };
    this.projectService.createProject(data).subscribe({
      next: (res: any) => {
        this.notification.create(
          'success',
          'Success',
          'You have successfully created a Project'
        );
        this.isVisible = false;
        this.projectService.setSelectedProject(res);
        this.router.navigateByUrl(`dashboard/research/${res.id}`);
      },
      error: (error: any) => {
        this.notification.create('error', 'error', 'an error occured');
      },
    });
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
