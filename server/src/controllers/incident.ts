import { Request, Response } from "express";
import { Incident } from "../entity/Incident";
import { createIncidentValidator } from "../utils/validators";

export const fieldsToSelect = [
  "incident.id",
  "incident.title",
  "incident.type",
  "incident.description",
  "incident.createdAt",
  "incident.updatedAt",
  "incident.isResolved",
  "incident.closedAt",
  "incident.isAcknowledged",
  "incident.acknowledgedAt",
  "incident.createdById",
  "incident.updatedById",
  "incident.assigneeId",
  "assignee.id",
  "assignee.username",
  "createdBy.id",
  "createdBy.username",
  "updatedBy.id",
  "updatedBy.username",
  "closedBy.id",
  "closedBy.username",
  "acknowledgedBy.id",
  "acknowledgedBy.username",
  "notes.id",
  "notes.body",
  "notes.createdAt",
  "notes.updatedAt",
  "noteAuthor.id",
  "noteAuthor.username",
];

export const getIncidents = async (req: Request, res: Response) => {
  const incidents = await Incident.createQueryBuilder("incident")
    .where(
      "incident.assigneeId = :userId or incident.createdById = :createdById",
      { userId: req.user, createdById: req.user }
    )
    .leftJoinAndSelect("incident.assignee", "assignee")
    .leftJoinAndSelect("incident.notes", "notes")
    .leftJoinAndSelect("notes.author", "noteAuthor")
    .leftJoinAndSelect("incident.createdBy", "createdBy")
    .leftJoinAndSelect("incident.updatedBy", "updatedBy")
    .leftJoinAndSelect("incident.closedBy", "closedBy")
    .leftJoinAndSelect("incident.acknowledgedBy", "acknowledgedBy")
    .select(fieldsToSelect)
    .getMany();
  return res.json(incidents);
};

export const createIncident = async (req: Request, res: Response) => {
  const { title, assigneeId, description, type } = req.body;

  const { errors, valid } = createIncidentValidator(
    title,
    assigneeId,
    description,
    type
  );

  if (!valid) {
    return res.status(400).send({ message: Object.values(errors)[0] });
  }

  const newIncident = Incident.create({
    title,
    assigneeId,
    description,
    type,
    createdById: req.user,
  });

  await newIncident.save();

  const relationedIncident = await Incident.createQueryBuilder("incident")
    .where("incident.id = :incidentId", { incidentId: newIncident.id })
    .leftJoinAndSelect("incident.assignee", "assignee")
    .leftJoinAndSelect("incident.notes", "notes")
    .leftJoinAndSelect("notes.author", "noteAuthor")
    .leftJoinAndSelect("incident.createdBy", "createdBy")
    .leftJoinAndSelect("incident.updatedBy", "updatedBy")
    .leftJoinAndSelect("incident.closedBy", "closedBy")
    .leftJoinAndSelect("incident.acknowledgedBy", "acknowledgedBy")
    .select(fieldsToSelect)
    .getOne();

  return res.status(201).json(relationedIncident);
};

export const deleteIncident = async (req: Request, res: Response) => {
  const { incidentId } = req.params;

  const targetIncident = await Incident.findOne({ id: incidentId });

  if (!targetIncident) {
    return res.status(400).send({ message: "Invalid incident ID." });
  }

  if (targetIncident.createdById !== req.user) {
    return res.status(401).send({ message: "Access is denied." });
  }

  await targetIncident.remove();
  return res.status(204).end();
};

export const closeIncident = async (req: Request, res: Response) => {
  const { incidentId } = req.params;

  const targetIncident = await Incident.findOne({ id: incidentId });

  if (!targetIncident) {
    return res.status(400).send({ message: "Invalid incident ID." });
  }

  const assigneeId = targetIncident?.assigneeId;
  if (assigneeId !== req.user) {
    return res.status(401).send({ message: "Access is denied." });
  }

  if (targetIncident.isResolved === true) {
    return res
      .status(400)
      .send({ message: "Incident is already marked as closed." });
  }

  targetIncident.isResolved = true;
  targetIncident.closedById = req.user;
  targetIncident.closedAt = new Date();

  await targetIncident.save();
  const relationedIncident = await Incident.createQueryBuilder("incident")
    .where("incident.id = :incidentId", { incidentId })
    .leftJoinAndSelect("incident.assignee", "assignee")
    .leftJoinAndSelect("incident.notes", "notes")
    .leftJoinAndSelect("notes.author", "noteAuthor")
    .leftJoinAndSelect("incident.createdBy", "createdBy")
    .leftJoinAndSelect("incident.updatedBy", "updatedBy")
    .leftJoinAndSelect("incident.closedBy", "closedBy")
    .leftJoinAndSelect("incident.acknowledgedBy", "acknowledgedBy")
    .select(fieldsToSelect)
    .getOne();

  return res.status(201).json(relationedIncident);
};

export const acknowledgeIncident = async (req: Request, res: Response) => {
  const { incidentId } = req.params;

  const targetIncident = await Incident.findOne({ id: incidentId });

  if (!targetIncident) {
    return res.status(400).send({ message: "Invalid incident ID." });
  }
  const assigneeId = targetIncident?.assigneeId;
  if (assigneeId !== req.user) {
    return res.status(401).send({ message: "Access is denied." });
  }

  if (targetIncident.isAcknowledged === true) {
    return res
      .status(400)
      .send({ message: "Incident is already marked as acknowledged." });
  }

  targetIncident.isAcknowledged = true;
  targetIncident.acknowledgedById = req.user;
  targetIncident.acknowledgedAt = new Date();
  targetIncident.closedById = null;
  targetIncident.closedAt = null;

  await targetIncident.save();
  const relationedBug = await Incident.createQueryBuilder("incident")
    .where("incident.id = :incidentId", { incidentId })
    .leftJoinAndSelect("incident.assignee", "assignee")
    .leftJoinAndSelect("incident.notes", "notes")
    .leftJoinAndSelect("notes.author", "noteAuthor")
    .leftJoinAndSelect("incident.createdBy", "createdBy")
    .leftJoinAndSelect("incident.updatedBy", "updatedBy")
    .leftJoinAndSelect("incident.closedBy", "closedBy")
    .leftJoinAndSelect("incident.acknowledgedBy", "acknowledgedBy")
    .select(fieldsToSelect)
    .getOne();

  return res.status(201).json(relationedBug);
};
