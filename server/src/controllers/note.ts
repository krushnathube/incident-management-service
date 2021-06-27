import { Request, Response } from "express";
import { Note } from "../entity/Note";
import { Incident } from "../entity/Incident";

export const postNote = async (req: Request, res: Response) => {
  const { body } = req.body;
  const { incidentId } = req.params;

  if (!body || body.trim() === "") {
    return res
      .status(400)
      .send({ message: "Note body field must not be empty." });
  }

  const incidentAssignee = await Incident.findOne({ id: incidentId });
  const assigneeId = incidentAssignee?.assigneeId;

  if (incidentAssignee?.createdById !== req.user && assigneeId !== req.user) {
    return res
      .status(401)
      .send({ message: "Access is denied. Not a assignee of the incident." });
  }

  const newNote = Note.create({ body, authorId: req.user, incidentId });
  await newNote.save();

  const relationedNote = await Note.createQueryBuilder("note")
    .where("note.id = :noteId", { noteId: newNote.id })
    .leftJoinAndSelect("note.author", "author")
    .select([
      "note.id",
      "note.incidentId",
      "note.body",
      "note.createdAt",
      "note.updatedAt",
      "author.id",
      "author.username",
    ])
    .getOne();

  return res.status(201).json(relationedNote);
};

export const deleteNote = async (req: Request, res: Response) => {
  const { incidentId, noteId } = req.params;

  const targetIncident = await Incident.findOne({
    where: { id: incidentId },
    relations: ["assignee"],
  });

  if (!targetIncident) {
    return res.status(400).send({ message: "Invalid incident ID." });
  }

  const targetNote = await Note.findOne({ id: Number(noteId) });

  if (!targetNote) {
    return res.status(400).send({ message: "Invalid note ID." });
  }

  if (targetNote.authorId !== req.user) {
    return res.status(401).send({ message: "Access is denied." });
  }

  await targetNote.remove();
  return res.status(204).end();
};

export const updateNote = async (req: Request, res: Response) => {
  const { body } = req.body;
  const { incidentId, noteId } = req.params;

  if (!body || body.trim() === "") {
    return res
      .status(400)
      .send({ message: "Note body field must not be empty." });
  }

  const targetIncident = await Incident.findOne({ id: incidentId });

  if (!targetIncident) {
    return res.status(400).send({ message: "Invalid incident ID." });
  }

  const targetNote = await Note.findOne({ id: Number(noteId) });

  if (!targetNote) {
    return res.status(400).send({ message: "Invalid note ID." });
  }

  if (targetNote.authorId !== req.user) {
    return res.status(401).send({ message: "Access is denied." });
  }

  targetNote.body = body;
  await targetNote.save();
  return res.status(201).json(targetNote);
};
