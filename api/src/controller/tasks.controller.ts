import type { Request, Response } from "express";
import { TasksService } from "../service/tasks.service.js";
import { HttpError } from "../errors/http-error.js";

export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  list = async (_req: Request, res: Response) => {
    const tasks = await this.tasksService.listTasks();
    return res.status(200).json(tasks);
  };

  create = async (req: Request, res: Response) => {
    const { title } = req.body ?? {};
    const task = await this.tasksService.createTask(title);
    return res.status(201).json(task);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const task = await this.tasksService.getTaskById(id);
    return res.status(200).json(task);
  };

  createNote = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (Array.isArray(id)) {
      throw new HttpError(400, "Invalid task ID");
    }
    if (typeof id !== "string" || !id.trim()) {
      throw new HttpError(400, "Invalid task ID");
    }
    const { text } = req.body ?? {};
    const result = await this.tasksService.addNoteToTask(id, text);
    return res.status(201).json(result);
  };
}
