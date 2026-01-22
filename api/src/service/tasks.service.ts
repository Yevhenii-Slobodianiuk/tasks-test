import { HttpError } from "../errors/http-error.js";
import type { PrismaClient } from "../generated/prisma/client.js";

const normalizeTitle = (input: string) => {
  return input.trim().charAt(0).toUpperCase() + input.trim().slice(1);
};

const slugify = (input: string) => {
  return input
    .trim()
    .toLowerCase()
    .replace(/!/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const parseLeadingTags = (raw: string): { tags: string[]; text: string } => {
  const trimmed = raw.trim();
  const leading = trimmed.match(/(^|\s)#([a-zA-Z0-9_-]+)(?=\s|$)/g);

  if (!leading) {
    return { tags: [], text: trimmed };
  }

  const prefix = leading[0];
  const tags = Array.from(prefix.matchAll(/#([a-zA-Z0-9_]+)/g)).map((m) =>
    m[1].toLowerCase()
  );

  const text = trimmed.slice(prefix.length).trim();

  return { tags: Array.from(new Set(tags)), text };
};

export class TasksService {
  constructor(private readonly prisma: PrismaClient) {}
  async listTasks() {
    const tasks = await this.prisma.task.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        notes: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    return tasks;
  }

  async createTask(title: unknown) {
    if (typeof title !== "string") {
      throw new HttpError(400, "Title must be a string");
    }
    const trimmed = title.trim();
    if (trimmed.length < 3) {
      throw new HttpError(400, "Title must be at least 3 characters");
    }
    let important = trimmed.endsWith("!");
    const normalizedTitle = normalizeTitle(trimmed);

    const baseSlug = slugify(normalizedTitle);
    if (!baseSlug) {
      throw new HttpError(400, "title cannot be converted to slug");
    }

    let slug = baseSlug;
    for (let i = 2; i < 50; i++) {
      const exists = await this.prisma.task.findUnique({ where: { slug } });
      if (!exists) break;
      slug = `${baseSlug}-${i}`;
    }

    const stillExists = await this.prisma.task.findUnique({ where: { slug } });
    if (stillExists) {
      throw new HttpError(409, "slug already exists");
    }

    return this.prisma.task.create({
      data: { title: normalizedTitle, important, slug },
      include: {
        notes: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    });
  }

  async getTaskById(id: unknown) {
    if (typeof id !== "string" || id.trim() === "") {
      throw new HttpError(400, "Invalid task ID");
    }
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!task) {
      throw new HttpError(404, "Task not found");
    }

    return task;
  }

  async addNoteToTask(taskId: string, text: string) {
    if (typeof taskId !== "string" || taskId.trim() === "") {
      throw new HttpError(400, "Invalid task ID");
    }
    if (typeof text !== "string" || text.trim() === "") {
      throw new HttpError(400, "Note content cannot be empty");
    }

    const exists = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!exists) {
      throw new HttpError(404, "Task not found");
    }

    const { tags, text: cleanedText } = parseLeadingTags(text);
    if (cleanedText.length === 0) {
      throw new HttpError(
        400,
        "Note content cannot be empty after removing tags"
      );
    }

    await this.prisma.note.create({
      data: {
        taskId,
        text: cleanedText,
        tags,
      },
    });

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        notes: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!task) {
      throw new HttpError(404, "Task not found");
    }

    return task;
  }
}
