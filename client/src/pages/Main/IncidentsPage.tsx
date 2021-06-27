import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIncidentsState } from '../../redux/slices/incidentsSlice';
import IncidentsTable from './IncidentsTable';
import IncidentsActionCard from './IncidentsActionCard';
import IncidentsListMobile from './IncidentsListMobile';
import LoadingSpinner from '../../components/LoadingSpinner';
import InfoText from '../../components/InfoText';

import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useMainPageStyles } from '../../styles/muiStyles';
import AssignmentIcon from '@material-ui/icons/Assignment';
import filterIncidents from '../../utils/filterIncidents';

const IncidentsPage = () => {
  const classes = useMainPageStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const { incidents, fetchStatus, fetchError, filterBy } = useSelector(
    selectIncidentsState
  );
  const [filterValue, setFilterValue] = useState('');

  const filteredSortedIncidents = filterIncidents(
    incidents.filter((p) =>
      p.title.toLowerCase().includes(filterValue.toLowerCase())
    ),
    filterBy
  ) || [];

  const incidentsDataToDisplay = () => {
    if (fetchStatus === 'loading') {
      return (
        <LoadingSpinner
          marginTop={isMobile ? '4em' : '9em'}
          size={isMobile ? 60 : 80}
        />
      );
    } else if (fetchStatus === 'succeeded' && incidents.length === 0) {
      return (
        <InfoText
          text="No Incidents added yet."
          variant={isMobile ? 'h6' : 'h5'}
        />
      );
    } else if (fetchStatus === 'failed' && fetchError) {
      return (
        <InfoText
          text={`Error: ${fetchError}`}
          variant={isMobile ? 'h6' : 'h5'}
        />
      );
    } else if (
      fetchStatus === 'succeeded' &&
      incidents.length !== 0 &&
      filteredSortedIncidents.length === 0
    ) {
      return (
        <InfoText text="No matches found." variant={isMobile ? 'h6' : 'h5'} />
      );
    } else {
      return (
        <div className={classes.incidentsListTable}>
          {!isMobile ? (
            <IncidentsTable incidents={filteredSortedIncidents} />
          ) : (
            <IncidentsListMobile incidents={filteredSortedIncidents} />
          )}
        </div>
      );
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.headerPaper}>
        <AssignmentIcon
          fontSize="large"
          color="primary"
          className={classes.headerIcon}
        />
        <div>
          <Typography variant={isMobile ? 'h6' : 'h5'} color="secondary">
            Incident Management Service
          </Typography>
          <Typography
            variant={isMobile ? 'caption' : 'subtitle1'}
            color="secondary"
          >
            Developed by Krushna Thube.
          </Typography>
        </div>
      </Paper>
      <Paper className={classes.incidentsPaper}>
        <IncidentsActionCard
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          isMobile={isMobile}
        />
        {incidentsDataToDisplay()}
      </Paper>
    </div>
  );
};

export default IncidentsPage;
