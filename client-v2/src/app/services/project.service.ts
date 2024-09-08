import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { project, program } from '../models/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private selectedReview = new BehaviorSubject<any>(null);
  public selectedProject$ = this.selectedReview.asObservable();

  constructor(private apiService: ApiService) {}
  getAllProject() {
    return this.apiService.get('project/all');
  }
  getProject(id: string) {
    return this.apiService.get(`project/${id}`);
  }

  setSelectedProject(project: any): void {
    this.selectedReview.next(project);
  }

  clearSelectedProject(): void {
    this.selectedReview.next(null);
  }
  createProject(data: project) {
    return this.apiService.post('project/create', data);
  }
  deleteProject(id: string) {
    return this.apiService.delete(`project/${id}`);
  }
  updateProject(id: string, data: project) {
    return this.apiService.update(`project/${id}`, data);
  }

  createProgram(data: program) {
    return this.apiService.post('project/program/create', data);
  }
  getAllProgram(id: string) {
    return this.apiService.get(`project/program/all/${id}`);
  }
  deleteProgram(id: string) {
    return this.apiService.delete(`project/program/${id}`);
  }
  getAllMutationResult(id: string) {
    return this.apiService.get(`project/mutation-result/${id}`);
  }
  // getUnfilteredPapers(id: string) {
  //   return this.apiService.get(`research/un/papers/${id}`);
  // }
}
