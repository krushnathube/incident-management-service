import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import {
  createNote,
  editNote,
  clearSubmitIncidentError,
  selectIncidentsState,
} from '../../redux/slices/incidentsSlice';
import ErrorBox from '../../components/ErrorBox';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { TextField, Button, InputAdornment } from '@material-ui/core';
import { useFormStyles } from '../../styles/muiStyles';
import CommentIcon from '@material-ui/icons/Comment';

const validationSchema = yup.object({
  body: yup.string().required('Required'),
});

interface NoteFormProps {
  closeDialog?: () => void;
  incidentId: string;
  isEditMode: boolean;
  currentBody?: string;
  noteId?: number;
}

const NoteForm: React.FC<NoteFormProps> = ({
  closeDialog,
  isEditMode,
  incidentId,
  currentBody,
  noteId,
}) => {
  const classes = useFormStyles();
  const dispatch = useDispatch();
  const { submitError, submitLoading } = useSelector(selectIncidentsState);
  const { register, handleSubmit, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      body: currentBody || '',
    },
  });

  const handleCreateNote = ({ body }: { body: string }) => {
    dispatch(createNote(incidentId, body, closeDialog));
  };

  const handleUpdateNote = ({ body }: { body: string }) => {
    dispatch(editNote(incidentId, noteId as number, body, closeDialog));
  };

  return (
    <form
      onSubmit={handleSubmit(isEditMode ? handleUpdateNote : handleCreateNote)}
    >
      <TextField
        multiline
        rows={1}
        rowsMax={4}
        inputRef={register}
        name="body"
        placeholder="Type a note..."
        required
        fullWidth
        type="text"
        label="Note"
        variant="outlined"
        error={'body' in errors}
        helperText={'body' in errors ? errors.body?.message : ''}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CommentIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />
      <Button
        size="large"
        color="primary"
        variant="contained"
        fullWidth
        className={classes.submitBtn}
        type="submit"
        disabled={submitLoading}
      >
        {isEditMode ? 'Update Note' : 'Submit Note'}
      </Button>
      {submitError && (
        <ErrorBox
          errorMsg={submitError}
          clearErrorMsg={() => dispatch(clearSubmitIncidentError())}
        />
      )}
    </form>
  );
};

export default NoteForm;
