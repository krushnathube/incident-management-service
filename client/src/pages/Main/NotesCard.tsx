import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthState } from '../../redux/slices/authSlice';
import { selectIncidentById } from '../../redux/slices/incidentsSlice';
import { deleteNote } from '../../redux/slices/incidentsSlice';
import { Note } from '../../redux/types';
import { RootState } from '../../redux/store';
import sortNotes from '../../utils/sortNotes';
import NoteForm from './NoteForm';
import ConfirmDialog from '../../components/ConfirmDialog';
import FormDialog from '../../components/FormDialog';
import InfoText from '../../components/InfoText';
import { formatTimeAgo } from '../../utils/helperFuncs';

import { Paper, Typography, Avatar, Divider } from '@material-ui/core';
import { useMainPageStyles } from '../../styles/muiStyles';
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import FilterBar from '../../components/FilterBar';

export type NoteSortValues = 'newest' | 'oldest' | 'updated';

const menuItems = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'updated', label: 'Recently Updated' },
];

const NotesCard: React.FC<{
  notes: Note[];
  incidentId: string;
  isMobile: boolean;
}> = ({ notes, incidentId, isMobile }) => {
  const classes = useMainPageStyles();
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuthState);
  const incident = useSelector((state: RootState) =>
    selectIncidentById(state, incidentId)
  );
  const [filterBy, setFilterBy] = useState<NoteSortValues>('newest');

  const handleFilterChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFilterBy(e.target.value as NoteSortValues);
  };

  const sortedNotes = sortNotes(notes, filterBy);

  const handleDeleteNote = (noteId: number) => {
    dispatch(deleteNote(incidentId, noteId));
  };

  return (
    <Paper className={classes.notesPaper}>
      <div className={classes.flexInput}>
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          color="secondary"
          className={classes.flexHeader}
        >
          <ForumOutlinedIcon
            fontSize={isMobile ? 'default' : 'large'}
            style={{ marginRight: '0.2em' }}
          />
          Notes
        </Typography>
        <div className={classes.sortNotesInput}>
          <FilterBar
            filterBy={filterBy}
            handleFilterChange={handleFilterChange}
            menuItems={menuItems}
            label="Notes"
            size="small"
          />
        </div>
      </div>
      <FormDialog
        triggerBtn={
          isMobile
            ? { type: 'fab', variant: 'round', icon: CommentOutlinedIcon }
            : {
                type: 'normal',
                text: 'Leave A Note',
                icon: CommentOutlinedIcon,
                size: 'large',
                style: { marginTop: '1em' },
              }
        }
        title="Post a note"
      >
        <NoteForm isEditMode={false} incidentId={incidentId} />
      </FormDialog>
      <div className={classes.notesWrapper}>
        <Divider />
        {sortedNotes.length === 0 && (
          <InfoText
            text="No notes added yet."
            variant={isMobile ? 'h6' : 'h5'}
          />
        )}
        {sortedNotes.map((n) => (
          <div key={n.id}>
            <div className={classes.singleNote}>
              <Avatar className={classes.avatar}>
                {n.author.username.slice(0, 1)}
              </Avatar>
              <div>
                <Typography color="secondary" variant="caption">
                  {n.author.username}
                </Typography>
                <Typography color="secondary" variant="caption">
                  <em> • {formatTimeAgo(n.createdAt)} ago</em>
                </Typography>
                {n.updatedAt !== n.createdAt && (
                  <Typography color="secondary" variant="caption">
                    {' '}
                    • updated <em>{formatTimeAgo(n.updatedAt)} ago</em>
                  </Typography>
                )}
                <Typography
                  color="secondary"
                  variant="subtitle1"
                  className={classes.noteBody}
                >
                  {n.body}
                </Typography>
                <div className={classes.notesBtnWrapper}>
                  {n.author.id === user?.id && (
                    <FormDialog
                      triggerBtn={{
                        type: 'normal',
                        text: 'Edit',
                        icon: EditIcon,
                        variant: 'outlined',
                        size: 'small',
                        style: { marginRight: '1em' },
                        color: 'secondary',
                      }}
                      title="Edit the note"
                    >
                      <NoteForm
                        isEditMode={true}
                        incidentId={incidentId}
                        noteId={n.id}
                        currentBody={n.body}
                      />
                    </FormDialog>
                  )}
                  {(n.author.id === user?.id ||
                    user?.id === incident?.createdBy.id) && (
                    <ConfirmDialog
                      title="Confirm Delete Note"
                      contentText="Are you sure you want to delete the note?"
                      actionBtnText="Delete Note"
                      triggerBtn={{
                        type: 'normal',
                        text: 'Delete',
                        icon: DeleteIcon,
                        variant: 'outlined',
                        size: 'small',
                        color: 'secondary',
                      }}
                      actionFunc={() => handleDeleteNote(n.id)}
                    />
                  )}
                </div>
              </div>
            </div>
            <Divider />
          </div>
        ))}
      </div>
    </Paper>
  );
};

export default NotesCard;
