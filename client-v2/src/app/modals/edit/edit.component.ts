import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ProjectService } from '../../services/project.service';
import { project } from '../../models/project';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NzModalModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
  processLoading: boolean = false;
  form: FormGroup;
  isVisible = false;
  projectID = ''
  constructor( private fb: FormBuilder, private projectService : ProjectService, private notification : NzNotificationService, private userService: UserService, private router: Router){
    this.form = fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }


  ngOnInit(): void {
    this.projectService.selectedProject$.subscribe((project) => {
      if (project) {
        this.projectID = project._id
        this.form.patchValue({
          title: project.title,
          description: project.description,
        });
      }
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
    const user = this.userService.getUser()
    data = { ...data, ...this.form.value, "user":user.id };
    this.projectService.updateProject(this.projectID, data).subscribe({
      next: (res:any) => {
        this.notification.create(
          'success',
          'Success',
          'Project was successfully Edited'
        );
        this.isVisible = false;
        this.router.navigateByUrl(`dashboard/project/${res.id}`);
      },
      error: (error: any) => {
        this.notification.create('error', 'error', 'an error occured');
      },
    })
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
