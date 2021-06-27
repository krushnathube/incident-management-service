import axios from 'axios';
import backendUrl from '../backendUrl';
import { setConfig } from './auth';

const baseUrl = `${backendUrl}/incidents`;

const createNote = async (
  incidentId: string,
  noteBody: string
) => {
  const response = await axios.post(
    `${baseUrl}/${incidentId}/notes`,
    { body: noteBody },
    setConfig()
  );
  return response.data;
};

const editNote = async (
  incidentId: string,
  noteId: number,
  noteBody: string
) => {
  const response = await axios.put(
    `${baseUrl}/${incidentId}/notes/${noteId}`,
    { body: noteBody },
    setConfig()
  );
  return response.data;
};

const deleteNote = async (incidentId: string, noteId: number) => {
  const response = await axios.delete(
    `${baseUrl}/${incidentId}/notes/${noteId}`,
    setConfig()
  );
  return response.data;
};

const noteService = {
  createNote,
  editNote,
  deleteNote,
};

export default noteService;
