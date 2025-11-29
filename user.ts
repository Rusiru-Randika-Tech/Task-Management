import { Repository } from './repository.ts';
import type { BaseEntity } from './repository.ts';
import { requireNonEmpty, validateEmail } from './validation.ts';
import { getAllProjects } from './project.ts';

// User entity associated with a single project
export interface User extends BaseEntity {
  username: string;
  email: string;
  projectId: number;
}

const userRepo = new Repository<User>();

// Creates a user after validating fields and project existence
export function createUser(username: string, email: string, projectId: number): User {
  requireNonEmpty(username, 'Username', 3, 30);
  validateEmail(email);
  if (!projectId) throw new Error('Project ID required for user');
  const projectExists = getAllProjects().some(p => p.id === projectId);
  if (!projectExists) throw new Error('Project does not exist');
  const user = userRepo.create({
    username: username.trim(),
    email: email.trim(),
    projectId,
  } as Omit<User, 'id' | 'createdAt'>);
  console.log('User created:', user);
  return user;
}

export function getAllUsers(): User[] {
  return userRepo.getAll();
}

// Logs all users with project association
export function showAllUsers(): void {
  const users = userRepo.getAll();
  if (users.length === 0) {
    console.log('\nNo users found.');
    return;
  }
  console.log('\n=== All Users ===');
  users.forEach((user, index) => {
    console.log(`\n${index + 1}. ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Project ID: ${user.projectId}`);
    console.log(`   Created: ${user.createdAt.toLocaleString()}`);
  });
}
