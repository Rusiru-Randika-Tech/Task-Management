import { Repository } from './repository.ts';
import type { BaseEntity } from './repository.ts';
import { requireNonEmpty, validateDate } from './validation.ts';

// Represents a project entity with basic metadata
export interface Project extends BaseEntity {
  name: string;
  description: string;
  startDate: Date;
}

const projectRepo = new Repository<Project>();

// Creates and stores a new project after validating inputs
export function createProject(name: string, description: string, startDate: string): Project {
  requireNonEmpty(name, 'Project name', 2, 60);
  requireNonEmpty(description, 'Project description', 5, 255);
  validateDate(startDate);
  const project = projectRepo.create({
    name: name.trim(),
    description: description.trim(),
    startDate: new Date(startDate),
  } as Omit<Project, 'id' | 'createdAt'>);
  console.log('Project created:', project);
  return project;
}

export function getAllProjects(): Project[] {
  return projectRepo.getAll();
}

// Logs all projects with details in a formatted list
export function showAllProjects(): void {
  const projects = projectRepo.getAll();
  if (projects.length === 0) {
    console.log('\nNo projects found.');
    return;
  }
  console.log('\n=== All Projects ===');
  projects.forEach((project, index) => {
    console.log(`\n${index + 1}. ${project.name}`);
    console.log(`   Description: ${project.description}`);
    console.log(`   Start Date: ${project.startDate.toLocaleDateString()}`);
    console.log(`   Created: ${project.createdAt.toLocaleString()}`);
  });
}
