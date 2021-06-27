import express from "express";
import { postNote, deleteNote, updateNote } from "../controllers/note";
import middleware from "../middleware";

const router = express.Router();
const { auth } = middleware;

router.post("/:incidentId/notes", auth, postNote);
router.delete("/:incidentId/notes/:noteId", auth, deleteNote);
router.put("/:incidentId/notes/:noteId", auth, updateNote);

export default router;
