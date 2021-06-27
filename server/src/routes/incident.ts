import express from "express";
import {
  createIncident,
  getIncidents,
  deleteIncident,
  closeIncident,
  acknowledgeIncident,
} from "../controllers/incident";
import middleware from "../middleware";

const router = express.Router();
const { auth } = middleware;

router.get("/", auth, getIncidents);
router.post("/", auth, createIncident);
router.delete("/:incidentId", auth, deleteIncident);
router.post("/:incidentId/close", auth, closeIncident);
router.post("/:incidentId/acknowledge", auth, acknowledgeIncident);

export default router;
