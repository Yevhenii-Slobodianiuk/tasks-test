import { Router } from "express";
import { TasksController } from "../controller/tasks.controller.js";

export function tasksRouter(controller: TasksController) {
  const router = Router();

  router.get("/tasks", controller.list);
  router.post("/tasks", controller.create);
  router.get("/tasks/:id", controller.getById);
  router.post("/tasks/:id/notes", controller.createNote);

  return router;
}
