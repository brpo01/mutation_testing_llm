import { Component, ViewChild } from '@angular/core';
import { ProjectService } from '../../../../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CreateQueryComponent } from '../../../../modals/create-query/create-query.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CommonModule } from '@angular/common';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EmptyComponent } from '../../../../components/empty/empty.component';
import { ChatboxComponent } from '../../../../components/chatbox/chatbox.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    NzInputModule,
    CreateQueryComponent,
    EmptyComponent,
    ChatboxComponent,
    NzSwitchModule,
    FormsModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  @ViewChild(CreateQueryComponent, { static: false })
  createQueryModal!: CreateQueryComponent;
  @ViewChild(ChatboxComponent, { static: false })
  openChatBox!: ChatboxComponent;
  emptyModal!: EmptyComponent;
  project: any;
  projectId: string = ' ';
  programs: Array<any> = [];
  mutationResults: Array<any> = [];
  // showUnfilteredPapers = false;
  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {
    this.projectId = this.route.snapshot.params['id'];
    this.getProject();
    this.getAllProgram();
    this.getAllMutationResults();
  }
  getProject() {
    this.projectService.getProject(this.projectId).subscribe({
      next: (res: any) => {
        this.project = res;
        if(res.length == 0) {
          this.notification.create(
            'Sorry',
            'Sorry',
            'there are no projects matching your criteria'
          );
        }
      },
    });
  }
  getAllProgram() {
    this.projectService.getAllProgram(this.projectId).subscribe({
      next: (res: any) => {
        if(res.data)
        this.programs = res.data;
      },
    });
  }
  deleteProgram(programID: any) {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this Program ?',
      nzContent:
        'Deleting this program will also remove all associated results',
      nzOkText: 'Delete',
      nzOkDanger: true,
      nzOnOk: () => {
        this.projectService.deleteProgram(programID).subscribe({
          next: (res: any) => {
            this.notification.create(
              'success',
              'Success',
              'Program was successfully deleted'
            );
            this.getAllProgram();
            this.getAllMutationResults();
          },
        });
      },
    });
  }
  getAllMutationResults() {
    this.projectService.getAllMutationResult(this.projectId).subscribe({
      next: (res: any) => {
        this.mutationResults = res.data;
      },
    });
  }

  // getUnfilteredPaper() {
  //   this.researchService.getUnfilteredPapers(this.researchId).subscribe({
  //     next: (res: any) => {
  //       this.primaryStudies = res.data
  //     }
  //   })
  // }
  showCreateQueryModal() {
    this.createQueryModal.showModal();
  }
  showChatBox() {
    this.openChatBox.open();
  }

  onSwitchChange(switchState: boolean): void {
    if (switchState) {
      this.getAllMutationResults();
    }
    else {
      this.getAllMutationResults();
    }
  }

}
