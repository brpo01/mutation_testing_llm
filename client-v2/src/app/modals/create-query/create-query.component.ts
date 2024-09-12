import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { program } from '../../models/project';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-create-query',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NzModalModule,
    NzSpinModule,
  ],
  templateUrl: './create-query.component.html',
  styleUrls: ['./create-query.component.css'], // Fixed typo
})
export class CreateQueryComponent {
  processLoading: boolean = false;
  form: FormGroup;
  isVisible = false;
  isSpinning = false;
  projectId = '';
  program: Array<any> = [];
  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private projectService: ProjectService,
    private activeRoute: ActivatedRoute
  ) {
    this.form = fb.group({
      program: ['', Validators.required],
      testcase: ['', Validators.required]
    });
    this.projectId = this.activeRoute.snapshot.params['id'];
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
        'Please check fields and try again'
      );
      return;
    }
    let data = new program();
    data = { ...data, ...this.form.value, projectId: this.projectId };
    this.isSpinning = true;
    this.projectService.createProgram(data).subscribe({
      next: (res: any) => {
        this.notification.create(
          'success',
          'Success',
          'You have successfully created a Mutation Test Analysis'
        );
        this.isVisible = false;
        this.getAllProgram();
        window.location.reload();
      },
      error: (error: any) => {
        this.isSpinning = false;
        this.notification.create('error', 'error', 'An error occurred');
      },
    });
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  getAllProgram() {
    this.projectService.getAllProgram(this.projectId).subscribe({
      next: (res: any) => {
        this.program = res.data;
        console.log(this.program);
      },
    });
  }

  // Handle file changes
  handleFileChange(event: Event, type: 'program' | 'testcase'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        console.log(`${type} file content:`, content);

        // For example, you can update the form control value with file content
        if (type === 'program') {
          this.form.patchValue({ program: content });
        } else {
          this.form.patchValue({ testcase: content });
        }
      };
      reader.readAsText(file);
    }
  }
}
