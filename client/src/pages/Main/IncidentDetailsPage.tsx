import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectIncidentById,
  deleteIncident,
  closeAcknowledgeIncident,
} from '../../redux/slices/incidentsSlice';
import { RootState } from '../../redux/store';
import FormDialog from '../../components/FormDialog';
import IncidentForm from './IncidentForm';
import ConfirmDialog from '../../components/ConfirmDialog';
import NotesCard from './NotesCard';
import { formatDateTime } from '../../utils/helperFuncs';
import { typeStyles, statusStyles } from '../../styles/customStyles';
import CSS from 'csstype';

import { Paper, Typography, Divider, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useMainPageStyles } from '../../styles/muiStyles';
import RedoIcon from '@material-ui/icons/Redo';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { selectAuthState } from '../../redux/slices/authSlice';

interface ParamTypes {
  incidentId: string;
}

const IncidentsDetailsPage = () => {
  const classes = useMainPageStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { incidentId } = useParams<ParamTypes>();
  const history = useHistory();
  const dispatch = useDispatch();
  const incident = useSelector((state: RootState) =>
    selectIncidentById(state, incidentId)
  );
  const { user } = useSelector(selectAuthState);

  if (!incident) {
    return (
      <div className={classes.root}>
        <Paper className={classes.notFoundPaper}>
          <Typography
            variant="h6"
            color="secondary"
            className={classes.error404Text}
            style={{ marginTop: '5em' }}
          >
            404: Incident Not Found!
          </Typography>
        </Paper>
      </div>
    );
  }

  const {
    title,
    assignee,
    description,
    type,
    isResolved,
    isAcknowledged,
    createdBy,
    createdAt,
    updatedBy,
    updatedAt,
    closedBy,
    closedAt,
    acknowledgedBy,
    acknowledgedAt,
    notes,
  } = incident;

  const handleDeleteIncident = () => {
    dispatch(deleteIncident(incidentId, history));
  };

  const handleCloseIncident = () => {
    dispatch(closeAcknowledgeIncident(incidentId, 'close'));
  };

  const handleAcknowledgeIncident = () => {
    dispatch(closeAcknowledgeIncident(incidentId, 'acknowledge'));
  };

  const statusCSS: CSS.Properties = {
    ...statusStyles(isAcknowledged, isResolved),
    display: 'inline',
    padding: '0.20em 0.4em',
  };

  const statusInfo = () => {
    if (isAcknowledged  && !isResolved && acknowledgedAt && acknowledgedBy) {
      return (
        <span>
          <div style={statusCSS}>Acknowledged</div> -{' '}
          <em>{formatDateTime(acknowledgedAt)}</em> ~{' '}
          <strong>{acknowledgedBy.username}</strong>
        </span>
      );
    } else if (isResolved && closedAt && closedBy) {
      return (
        <span>
          <div style={statusCSS}>Closed</div> -{' '}
          <em>{formatDateTime(closedAt)}</em> ~{' '}
          <strong>{closedBy.username}</strong>
        </span>
      );
    } else {
      return <div style={statusCSS}>Open</div>;
    }
  };

  const closeAcknowledgeBtns = () => {
    if (!isAcknowledged) {
      return (
        <ConfirmDialog
          title="Acknowledge the Incident"
          contentText="Are you sure you want to acknowledge the Incident?"
          actionBtnText="Acknowledge Incident"
          triggerBtn={{
            type: isMobile ? 'round' : 'normal',
            text: 'Acknowledge Incident',
            icon: RedoIcon,
          }}
          actionFunc={handleAcknowledgeIncident}
        />
      );
    } else if (!isResolved) {
      return (
        <ConfirmDialog
          title="Close the Incident"
          contentText="Are you sure you want to close the Incident?"
          actionBtnText="Close Incident"
          triggerBtn={{
            type: isMobile ? 'round' : 'normal',
            text: 'Close Incident',
            icon: DoneOutlineIcon,
          }}
          actionFunc={handleCloseIncident}
        />
      );
    }
  };

  const updateIncidentBtn = () => {
    if (createdBy.id === user?.id && !isResolved) {
      return (
        <FormDialog
          triggerBtn={{
            type: isMobile ? 'round' : 'normal',
            text: 'Update Incident Info',
            icon: EditOutlinedIcon,
            style: { marginLeft: '1em' },
          }}
          title="Edit the Incident details"
        >
          <IncidentForm
            currentTitle={title}
            currentAssignee={assignee.id}
            currentDescription={description}
            currentType={type}
            incidentId={incidentId}
          />
        </FormDialog>
      );
    }
  };

  const deleteIncidentBtn = () => {
    if (createdBy.id === user?.id) {
      return (
        <ConfirmDialog
          title="Confirm Delete Incident"
          contentText="Are you sure you want to permanently delete the Incident?"
          actionBtnText="Delete Incident"
          triggerBtn={{
            type: isMobile ? 'round' : 'normal',
            text: 'Delete Incident',
            icon: DeleteOutlineIcon,
            style: { marginLeft: '1em' },
          }}
          actionFunc={handleDeleteIncident}
        />
      );
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.detailsHeader}>
        <Typography variant={isMobile ? 'h5' : 'h4'} color="secondary">
          <strong>{title}</strong>
        </Typography>
        <Divider style={{ margin: '0.5em 0' }} />
        <Typography color="secondary" variant="h6">
          {description}
        </Typography>
        <Typography
          color="secondary"
          variant="subtitle2"
          className={classes.marginText}
        >
          Status: {statusInfo()}
        </Typography>
        <Typography
          color="secondary"
          variant="subtitle2"
          className={classes.marginText}
        >
          Type:{' '}
          <div
            style={{
              ...typeStyles(type),
              display: 'inline',
              padding: '0.20em 0.4em',
              textTransform: 'capitalize',
            }}
          >
            {type}
          </div>
        </Typography>
        <Typography color="secondary" variant="subtitle2">
          Created: <em>{formatDateTime(createdAt)}</em> ~{' '}
          <strong>{createdBy.username}</strong>
        </Typography>
        {updatedBy && updatedAt && (
          <Typography color="secondary" variant="subtitle2">
            Updated: <em>{formatDateTime(updatedAt)}</em> ~{' '}
            <strong>{updatedBy.username}</strong>
          </Typography>
        )}
        <div className={classes.btnsWrapper}>
          {closeAcknowledgeBtns()}
          {/* {updateIncidentBtn()} */}
          {deleteIncidentBtn()}
        </div>
      </Paper>
      <NotesCard
        notes={notes}
        incidentId={incidentId}
        isMobile={isMobile}
      />
    </div>
  );
};

export default IncidentsDetailsPage;
