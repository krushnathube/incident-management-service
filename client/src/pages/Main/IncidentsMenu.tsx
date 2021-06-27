import { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  closeAcknowledgeIncident,
  deleteIncident,
} from '../../redux/slices/incidentsSlice';
import ConfirmDialog from '../../components/ConfirmDialog';
import FormDialog from '../../components/FormDialog';
import IncidentForm from './IncidentForm';

import { Menu, IconButton, MenuItem } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import RedoIcon from '@material-ui/icons/Redo';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import { IncidentType, User } from '../../redux/types';
import NoteForm from './NoteForm';

interface IncidentsMenuProps {
  incidentId: string;
  title: string;
  assignee: User;
  description: string;
  type: IncidentType;
  isAdmin: boolean;
  isResolved: boolean;
  isAcknowledged: boolean;
  iconSize?: 'small' | 'default' | 'large';
}

const IncidentsMenu: React.FC<IncidentsMenuProps> = ({
  incidentId,
  title,
  assignee,
  description,
  type,
  isResolved,
  isAcknowledged,
  isAdmin,
  iconSize,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDeleteIncident = () => {
    dispatch(deleteIncident(incidentId, history));
  };

  const handleAcknowledgeIncident = () => {
    dispatch(closeAcknowledgeIncident(incidentId, 'acknowledge'));
  };

  const handleCloseIncident = () => {
    dispatch(closeAcknowledgeIncident(incidentId, 'close'));
  };

  return (
    <div>
      <IconButton onClick={handleOpenMenu} size="small">
        <MoreHorizIcon color="primary" fontSize={iconSize || 'large'} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        marginThreshold={8}
        elevation={4}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem
          onClick={handleCloseMenu}
          component={RouterLink}
          to={`/incidents/${incidentId}`}
        >
          <OpenInNewIcon style={{ marginRight: '10px' }} />
          Incident Details
        </MenuItem>
        {!isAcknowledged && (
          <ConfirmDialog
            title="Acknowledge the Incident"
            contentText="Are you sure you want to acknowledge the incident?"
            actionBtnText="Acknowledge Incident"
            triggerBtn={{
              type: 'menu',
              text: 'Acknowledge Incident',
              icon: RedoIcon,
              iconStyle: { marginRight: '10px' },
              closeMenu: handleCloseMenu,
            }}
            actionFunc={handleAcknowledgeIncident}
          />
        )}
        {isAcknowledged && !isResolved && (
          <ConfirmDialog
            title="Close the Incident"
            contentText="Are you sure you want to close the incident?"
            actionBtnText="Close Incident"
            triggerBtn={{
              type: 'menu',
              text: 'Close Incident',
              icon: DoneOutlineIcon,
              iconStyle: { marginRight: '10px' },
              closeMenu: handleCloseMenu,
            }}
            actionFunc={handleCloseIncident}
          />
        )}
      </Menu>
    </div>
  );
};

export default IncidentsMenu;
