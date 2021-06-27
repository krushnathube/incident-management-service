import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import incidentService from '../../services/incidents';
import {
  IncidentState,
  IncidentPayload,
  IncidentFilterValues,
  ClosedAcknowledgedIncidentData,
  Note,
  User,
} from '../types';
import { notify } from './notificationSlice';
import { History } from 'history';
import { getErrorMsg } from '../../utils/helperFuncs';
import noteService from '../../services/notes';

interface InitialIncidentsState {
  incidents: IncidentState[];
  fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  fetchError: string | null;
  submitLoading: boolean;
  submitError: string | null;
  filterBy: IncidentFilterValues;
}

const initialState: InitialIncidentsState = {
  incidents: [],
  fetchStatus: 'idle',
  fetchError: null,
  submitLoading: false,
  submitError: null,
  filterBy: 'all',
};

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setIncidents: (state, action: PayloadAction<IncidentState[]>) => {
      state.incidents = action.payload;
      state.fetchStatus = 'succeeded';
      state.fetchError = null;
    },
    addIncident: (state, action: PayloadAction<IncidentState>) => {
      state.incidents.push(action.payload);
      state.submitLoading = false;
      state.submitError = null;
    },
    removeIncident: (state, action: PayloadAction<string>) => {
      state.incidents = state.incidents.filter((p) => p.id !== action.payload);
    },
    updateIncidentTitle: (
      state,
      action: PayloadAction<{
        data: { title: string; updatedAt: Date };
        incidentId: string;
      }>
    ) => {
      state.incidents = state.incidents.map((p) =>
        p.id === action.payload.incidentId ? { ...p, ...action.payload.data } : p
      );
      state.submitLoading = false;
      state.submitError = null;
    },
    addAssignees: (
      state,
      action: PayloadAction<{ assignee: User; incidentId: string }>
    ) => {
      state.incidents = state.incidents.map((i) =>
        i.id === action.payload.incidentId
          ? { ...i, assignee: action.payload.assignee }
          : i
      );
      state.submitLoading = false;
      state.submitError = null;
    },
    updateIncidentStatus: (
      state,
      action: PayloadAction<{
        data: ClosedAcknowledgedIncidentData;
        incidentId: string;
      }>
    ) => {
      state.incidents = state.incidents.map((i) =>
        i.id === action.payload.incidentId
          ? { ...i, ...action.payload.data }
          : i
      );
    },
    addNote: (
      state,
      action: PayloadAction<{ note: Note; incidentId: string }>
    ) => {
      state.incidents = state.incidents.map((i) =>
        i.id === action.payload.incidentId
          ? { ...i, notes: [...i.notes, action.payload.note] }
          : i
      );
      state.submitLoading = false;
      state.submitError = null;
    },
    updateNote: (
      state,
      action: PayloadAction<{
        data: { body: string; updatedAt: Date };
        noteId: number;
        incidentId: string;
      }>
    ) => {
      const incident = state.incidents.find(
        (i) => i.id === action.payload.incidentId
      );

      if (incident) {
        const updatedNotes = incident.notes.map((n) =>
          n.id === action.payload.noteId ? { ...n, ...action.payload.data } : n
        );

        state.incidents = state.incidents.map((i) =>
          i.id === action.payload.incidentId
            ? { ...i, notes: updatedNotes }
            : i
        );

        state.submitLoading = false;
        state.submitError = null;
      }
    },
    removeNote: (
      state,
      action: PayloadAction<{
        noteId: number;
        incidentId: string;
      }>
    ) => {
      const incident = state.incidents.find(
        (i) => i.id === action.payload.incidentId
      );

      if (incident) {
        const updatedNotes = incident.notes.filter((n) =>
          n.id !== action.payload.noteId
        );

        state.incidents = state.incidents.map((i) =>
          i.id === action.payload.incidentId
            ? { ...i, notes: updatedNotes }
            : i
        );
      }
    },
    setFetchIncidentsLoading: (state) => {
      state.fetchStatus = 'loading';
      state.fetchError = null;
    },
    setFetchIncidentsError: (state, action: PayloadAction<string>) => {
      state.fetchStatus = 'failed';
      state.fetchError = action.payload;
    },

    setSubmitIncidentLoading: (state) => {
      state.submitLoading = true;
      state.submitError = null;
    },
    setSubmitIncidentError: (state, action: PayloadAction<string>) => {
      state.submitLoading = false;
      state.submitError = action.payload;
    },
    clearSubmitIncidentError: (state) => {
      state.submitError = null;
    },
    filterIncidentsBy: (state, action: PayloadAction<IncidentFilterValues>) => {
      state.filterBy = action.payload;
    },
  },
});

export const {
  setIncidents,
  addIncident,
  removeIncident,
  updateIncidentTitle,
  addAssignees,
  updateIncidentStatus,
  addNote,
  updateNote,
  removeNote,
  setFetchIncidentsLoading,
  setFetchIncidentsError,
  setSubmitIncidentLoading,
  setSubmitIncidentError,
  clearSubmitIncidentError,
  filterIncidentsBy,
} = incidentsSlice.actions;

export const fetchIncidents = (): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setFetchIncidentsLoading());
      const allIncidents = await incidentService.getIncidents();
      dispatch(setIncidents(allIncidents));
    } catch (e) {
      dispatch(setFetchIncidentsError(getErrorMsg(e)));
    }
  };
};

export const createNewIncident = (
  incidentData: IncidentPayload,
  closeDialog?: () => void
): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setSubmitIncidentLoading());
      const newIncident = await incidentService.createIncident(incidentData);
      dispatch(addIncident(newIncident));
      dispatch(notify('New incident added!', 'success'));
      closeDialog && closeDialog();
    } catch (e) {
      dispatch(setSubmitIncidentError(getErrorMsg(e)));
    }
  };
};

export const deleteIncident = (
  incidentId: string,
  history: History
): AppThunk => {
  return async (dispatch) => {
    try {
      await incidentService.deleteIncident(incidentId);
      history.push('/');
      dispatch(removeIncident(incidentId));
      dispatch(notify('Deleted the incident.', 'success'));
    } catch (e) {
      dispatch(notify(getErrorMsg(e), 'error'));
    }
  };
};

export const editIncidentTitle = (
  incidentId: string,
  title: string,
  closeDialog?: () => void
): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setSubmitIncidentLoading());
      const updatedIncident = await incidentService.editIncidentTitle(
        incidentId,
        title,
      );
      dispatch(
        updateIncidentTitle({
          data: {
            title: updatedIncident.title,
            updatedAt: updatedIncident.updatedAt,
          },
          incidentId,
        })
      );
      dispatch(notify("Edited the incident's title!", 'success'));
      closeDialog && closeDialog();
    } catch (e) {
      dispatch(setSubmitIncidentError(getErrorMsg(e)));
    }
  };
};

export const closeAcknowledgeIncident = (
  incidentId: string,
  action: 'close' | 'acknowledge'
): AppThunk => {
  return async (dispatch) => {
    try {
      let returnedData;
      if (action === 'close') {
        returnedData = await incidentService.closeIncident(incidentId);
      } else {
        returnedData = await incidentService.reopenIncident(incidentId);
      }
      const {
        isResolved,
        isAcknowledged,
        closedAt,
        closedBy,
        acknowledgedAt,
        acknowledgedBy,
      } = returnedData as ClosedAcknowledgedIncidentData;
      dispatch(
        updateIncidentStatus({
          data: { isResolved, isAcknowledged, closedAt, closedBy, acknowledgedAt, acknowledgedBy },
          incidentId,
        })
      );
      dispatch(
        notify(
          `${action === 'close' ? 'Closed' : 'Acknowledged'} the incident!`,
          'success'
        )
      );
    } catch (e) {
      dispatch(notify(getErrorMsg(e), 'error'));
    }
  };
};

export const createNote = (
  incidentId: string,
  noteBody: string,
  closeDialog?: () => void
): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setSubmitIncidentLoading());
      const newNote = await noteService.createNote(incidentId, noteBody);
      dispatch(addNote({ note: newNote, incidentId }));
      dispatch(notify('New note added!', 'success'));
      closeDialog && closeDialog();
    } catch (e) {
      dispatch(setSubmitIncidentError(getErrorMsg(e)));
    }
  };
};

export const editNote = (
  incidentId: string,
  noteId: number,
  noteBody: string,
  closeDialog?: () => void
): AppThunk => {
  return async (dispatch) => {
    try {
      dispatch(setSubmitIncidentLoading());
      const returnedData = await noteService.editNote(
        incidentId,
        noteId,
        noteBody
      );
      const { body, updatedAt } = returnedData as Note;
      dispatch(
        updateNote({ data: { body, updatedAt }, noteId, incidentId })
      );
      dispatch(notify('Updated the note!', 'success'));
      closeDialog && closeDialog();
    } catch (e) {
      dispatch(setSubmitIncidentError(getErrorMsg(e)));
    }
  };
};

export const deleteNote = (
  incidentId: string,
  noteId: number
): AppThunk => {
  return async (dispatch) => {
    try {
      await noteService.deleteNote(incidentId, noteId);
      dispatch(removeNote({ noteId, incidentId }));
      dispatch(notify('Deleted the note.', 'success'));
    } catch (e) {
      dispatch(notify(getErrorMsg(e), 'error'));
    }
  };
};

export const selectIncidentsState = (state: RootState) => state.incidents;

export const selectIncidentById = (state: RootState, incidentId: string) => {
  return state.incidents.incidents.find((i) => i.id === incidentId);
};

export default incidentsSlice.reducer;
