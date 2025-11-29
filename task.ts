import { Repository } from './repository.ts';
import type { BaseEntity } from './repository.ts';
import { requireNonEmpty } from './validation.ts';

// Allowed lifecycle states for a task
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

// Task entity extending common base fields
export interface Task extends BaseEntity {
  name: string;
  description: string;
  status: TaskStatus;
  projectId: number;
  userId: number; // mandatory now
}

const taskRepo = new Repository<Task>();

// Creates a new task linked to project and user
export function createTask(name: string, description: string, projectId: number, userId: number): Task {
  requireNonEmpty(name, 'Task name', 2, 80);
  requireNonEmpty(description, 'Task description', 5, 255);
  if (!projectId) {
    throw new Error('Project ID is required');
  }
  if (!userId) {
    throw new Error('User ID is required');
  }
  const task = taskRepo.create({
    name: name.trim(),
    description: description.trim(),
    status: 'pending',
    projectId,
    userId,
  } as Omit<Task, 'id' | 'createdAt'>);
  console.log('Task created:', task);
  return task;
}

export function getAllTasks(): Task[] {
  return taskRepo.getAll();
}

// Prints all tasks with details in a formatted list
export function showAllTasks(): void {
  const tasks = taskRepo.getAll();
  if (tasks.length === 0) {
    console.log('\nNo tasks found.');
    return;
  }
  console.log('\n=== All Tasks ===');
  tasks.forEach((task, index) => {
    console.log(`\n${index + 1}. ${task.name}`);
    console.log(`   Description: ${task.description}`);
    console.log(`   Status: ${task.status}`);
    console.log(`   Project ID: ${task.projectId}`);
    console.log(`   User ID: ${task.userId}`);
    console.log(`   Created: ${task.createdAt.toLocaleString()}`);
  });
}
