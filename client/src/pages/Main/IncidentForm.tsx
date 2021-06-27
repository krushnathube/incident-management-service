import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import {
  createNewIncident,
  selectIncidentsState,
  clearSubmitIncidentError,
} from '../../redux/slices/incidentsSlice';
import { selectUsersState } from '../../redux/slices/usersSlice';
import { IncidentType, User } from '../../redux/types';
import ErrorBox from '../../components/ErrorBox';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  TextField,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  InputAdornment,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  FormControl,
  Select,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useFormStyles } from '../../styles/muiStyles';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import GroupIcon from '@material-ui/icons/Group';
import SubjectIcon from '@material-ui/icons/Subject';

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Required')
    .max(60, 'Must be at most 60 characters'),

  description: yup.string().required('Required'),
});

interface BaseType {
  closeDialog?: () => void;
}

interface CreateIncident extends BaseType {
  currentTitle?: string;
  currentAssignee?: string;
  currentDescription?: string;
  currentType?: IncidentType;
  incidentId?: string;
}

interface EditIncident extends BaseType {
  currentTitle?: string;
  currentAssignee?: string;
  currentDescription?: string;
  currentType?: IncidentType;
  incidentId?: string;
}

type IncidentFormProps = CreateIncident | EditIncident;

const IncidentForm: React.FC<IncidentFormProps> = ({
  closeDialog,
  currentTitle,
  currentAssignee,
  currentDescription,
  currentType,
}) => {
  const classes = useFormStyles();
  const dispatch = useDispatch();
  const { submitError, submitLoading } = useSelector(selectIncidentsState);
  const { users } = useSelector(selectUsersState);
  const { register, control, handleSubmit, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: currentTitle || '',
      assignee: currentAssignee || '',
      description: currentDescription || '',
      type: currentType || 'employee',
    },
  });
  const [assigneeId, setAssignee] = useState<string>('');

  const selectAssigneeOnChange = (e: any, selectedOption: any) => {
    setAssignee(selectedOption?.id || '');
  };

  const handleCreateIncident = ({ title, description, type }: { title: string, description: string, type: IncidentType }) => {
    dispatch(createNewIncident({ title, assigneeId, description, type }, closeDialog));
  };

  return (
    <form
      onSubmit={
        handleSubmit(
          handleCreateIncident
        )
      }
    >
      <TextField
        inputRef={register}
        name="title"
        required
        fullWidth
        type="text"
        label="Incident Title"
        variant="outlined"
        error={'title' in errors}
        helperText={'title' in errors ? errors.title?.message : ''}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LabelImportantIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />
      <Autocomplete
          style={{ marginTop: '1.5em' }}
          filterSelectedOptions
          onChange={selectAssigneeOnChange}
          options={
            users
          }
          getOptionLabel={(option) => option.username}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Select Assignees"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment
                      position="start"
                      style={{ paddingLeft: '0.4em' }}
                    >
                      <GroupIcon color="primary" />
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
              inputProps={{
                ...params.inputProps,
                required: assigneeId,
              }}
            />
          )}
          renderOption={(option) => (
            <ListItem dense component="div">
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  {option.username.slice(0, 1)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={option.username}
                primaryTypographyProps={{
                  color: 'secondary',
                  variant: 'body1',
                }}
              />
            </ListItem>
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                avatar={<Avatar>{option.username.slice(0, 1)}</Avatar>}
                color="secondary"
                variant="outlined"
                label={option.username}
                {...getTagProps({ index })}
              />
            ))
          }
        />
      <TextField
        className={classes.fieldMargin}
        multiline
        rows={2}
        rowsMax={4}
        inputRef={register}
        name="description"
        required
        fullWidth
        type="text"
        label="Description"
        variant="outlined"
        error={'description' in errors}
        helperText={'description' in errors ? errors.description?.message : ''}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SubjectIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />
      <Controller
        control={control}
        name="type"
        as={
          <FormControl className={classes.radioGroupForm}>
            <RadioGroup row defaultValue="employee" className={classes.radioGroup}>
              <FormLabel className={classes.radioGroupLabel}>
                Type:
              </FormLabel>
              <div className={classes.formControlLabels}>
                <FormControlLabel
                  value="employee"
                  control={<Radio color="primary" />}
                  label="Employee"
                />
                <FormControlLabel
                  value="environmental"
                  control={<Radio color="primary" />}
                  label="Environmental"
                />
                <FormControlLabel
                  value="property"
                  control={<Radio color="primary" />}
                  label="Property"
                />
                <FormControlLabel
                  value="vehicle"
                  control={<Radio color="primary" />}
                  label="Vehicle"
                />
                <FormControlLabel
                  value="fire"
                  control={<Radio color="primary" />}
                  label="Fire"
                />
              </div>
            </RadioGroup>
          </FormControl>
        }
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
        { 'Create New Incident' }
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

export default IncidentForm;
