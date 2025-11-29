import * as readline from 'readline';
import { createTask, showAllTasks } from './task.ts';
import { createProject, showAllProjects, getAllProjects } from './project.ts';
import { createUser, getAllUsers, showAllUsers } from './user.ts';


// Orchestrates interactive CLI flows for managing entities
class Manager {
  private rl: readline.Interface;

  // Initializes readline interface for user interaction
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  // Displays the main menu options
  async ShowMenu() {
    console.log('\n=== Task Management System ===');
    console.log('1. Create Task');
    console.log('2. Create User');
    console.log('3. Create Project');
    console.log('4. Show All Tasks');
    console.log('5. Show All Projects');
    console.log('6. Show All Users');
    console.log('7. Exit');
  }

  // Routes a numeric choice to the appropriate action
  async HandleUserInput(input: number) {
    switch (input) {
      case 1:
        await this.CreateTask();
        break;
      case 2:
        await this.CreateUserPrompt();
        break;
      case 3:
        await this.CreateProject();
        break;
      case 4:
        showAllTasks();
        break;
      case 5:
        showAllProjects();
        break;
      case 6:
        showAllUsers();
        break;
      case 7:
        console.log('Exiting...');
        this.rl.close();
        process.exit(0);
      default:
        console.log('Invalid option. Please try again.');
    }
  }

  // Prompts for a menu choice and parses it
  async GetUserInput(): Promise<number> {
    return new Promise((resolve) => {
      this.rl.question('\nEnter your choice: ', (answer) => {
        const choice = parseInt(answer);
        resolve(choice);
      });
    });
  }

  // General string input helper with a custom prompt
  async GetStringInput(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => {
        resolve(answer);
      });
    });
  }

  // Guided flow to create a task with project/user selection
  async CreateTask() {
    console.log('\n--- Creating New Task ---');
    const projects = getAllProjects();

    if (projects.length === 0) {
      console.log('⚠ No projects found. You must create a project before creating a task.');
      return;
    }

    console.log('\nSelect a project for this task:');
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.name} (ID: ${project.id})`);
    });

    const projectChoice = await this.GetStringInput('\nEnter project number: ');
    const projectIndex = parseInt(projectChoice) - 1;

    if (isNaN(projectIndex) || projectIndex < 0 || projectIndex >= projects.length) {
      console.log('❌ Invalid project selection.');
      return;
    }

    const selectedProject = projects[projectIndex]!;
    console.log(`Selected Project: ${selectedProject.name}`);

    // Mandatory user selection filtered by project
    const usersForProject = getAllUsers().filter(u => u.projectId === selectedProject.id);
    if (usersForProject.length === 0) {
      console.log('⚠ No users for this project. Create a user assigned to this project first.');
      return;
    }
    console.log('\nSelect a user for this task:');
    usersForProject.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (ID: ${user.id})`);
    });
    const userChoice = await this.GetStringInput('\nEnter user number: ');
    const userIndex = parseInt(userChoice) - 1;
    if (isNaN(userIndex) || userIndex < 0 || userIndex >= usersForProject.length) {
      console.log('❌ Invalid user selection.');
      return;
    }
    const userId = usersForProject[userIndex]!.id;
    console.log(`Assigned User: ${usersForProject[userIndex]!.username}`);

    // Now collect task details after mandatory selections
    let taskName: string;
    while (true) {
      taskName = await this.GetStringInput('Enter task name: ');
      if (taskName && taskName.trim().length >= 2) break;
      console.log('❌ Task name must be at least 2 characters');
    }
    let taskDescription: string;
    while (true) {
      taskDescription = await this.GetStringInput('Enter task description: ');
      if (taskDescription && taskDescription.trim().length >= 5) break;
      console.log('❌ Task description must be at least 5 characters');
    }

    try {
      createTask(taskName, taskDescription, selectedProject.id, userId);
      console.log('\n✓ Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  // Guided flow to create a user tied to a project
  async CreateUserPrompt() {
    console.log('\n--- Creating New User ---');
    const projects = getAllProjects();
    if (projects.length === 0) {
      console.log('⚠ No projects exist. Create a project first.');
      return;
    }
    console.log('\nSelect a project for this user:');
    projects.forEach((p, i) => console.log(`${i + 1}. ${p.name} (ID: ${p.id})`));
    const projChoice = await this.GetStringInput('\nEnter project number: ');
    const projIndex = parseInt(projChoice) - 1;
    if (isNaN(projIndex) || projIndex < 0 || projIndex >= projects.length) {
      console.log('❌ Invalid project selection.');
      return;
    }
    const projectId = projects[projIndex]!.id;
    let username: string;
    while (true) {
      username = await this.GetStringInput('Enter username: ');
      if (username && username.trim().length >= 3) break;
      console.log('❌ Username must be at least 3 characters');
    }
    let email: string;
    while (true) {
      email = await this.GetStringInput('Enter email: ');
      if (/^[\w.!#$%&'*+/=?`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) break;
      console.log('❌ Invalid email format');
    }
    try {
      createUser(username, email, projectId);
      console.log('\n✓ User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  // Guided flow to create a project after validation
  async CreateProject() {
    console.log('\n--- Creating New Project ---');
    let projectName: string;
    while (true) {
      projectName = await this.GetStringInput('Enter project name: ');
      if (projectName && projectName.trim().length >= 2) break;
      console.log('❌ Project name must be at least 2 characters');
    }
    let projectDescription: string;
    while (true) {
      projectDescription = await this.GetStringInput('Enter project description: ');
      if (projectDescription && projectDescription.trim().length >= 5) break;
      console.log('❌ Description must be at least 5 characters');
    }
    let startDate: string;
    while (true) {
      startDate = await this.GetStringInput('Enter start date (YYYY-MM-DD): ');
      if (/^\d{4}-\d{2}-\d{2}$/.test(startDate) && !isNaN(new Date(startDate).getTime())) break;
      console.log('❌ Invalid date; use format YYYY-MM-DD');
    }
    try {
      createProject(projectName, projectDescription, startDate);
      console.log('\n✓ Project created successfully!');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  }

  // Main loop: show menu and handle user choices
  async Run() {
    while (true) {
      await this.ShowMenu();
      const choice = await this.GetUserInput();
      await this.HandleUserInput(choice);
      if (choice === 7) break;
    }
  }
}

const manager = new Manager();
manager.Run();
