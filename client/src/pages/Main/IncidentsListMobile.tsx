import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IncidentState } from '../../redux/types';
import { selectAuthState } from '../../redux/slices/authSlice';
import IncidentsMenu from './IncidentsMenu';
import { formatDateTime, truncateString } from '../../utils/helperFuncs';

import { Divider, Typography, Link } from '@material-ui/core';
import { useMainPageStyles } from '../../styles/muiStyles';
import BugReportTwoToneIcon from '@material-ui/icons/BugReportTwoTone';
import PeopleAltTwoToneIcon from '@material-ui/icons/PeopleAltTwoTone';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const IncidentsListMobile: React.FC<{ incidents: IncidentState[] }> = ({
  incidents,
}) => {
  const classes = useMainPageStyles();
  const { user } = useSelector(selectAuthState);

  return (
    <div>
      <Divider />
      {incidents.map((p, i) => (
        <div
          key={p.id}
          style={{ paddingBottom: i + 1 === incidents.length ? '2em' : 0 }}
        >
          <div className={classes.listItemWrapper}>
            <Link
              component={RouterLink}
              to={`/incidents/${p.id}`}
              color="secondary"
              variant="h6"
            >
              {truncateString(p.title, 30)}
              <OpenInNewIcon color="primary" className={classes.gotoIcon} />
            </Link>
            <Typography variant="body2" color="secondary">
              Admin: <strong>{p.createdBy.username}</strong>
            </Typography>
            <Typography variant="body2" color="secondary">
              Created: <strong>{formatDateTime(p.createdAt)}</strong>
            </Typography>
            <div className={classes.flexedWrapper}>
              <div className={classes.textIconsWrapper}>
                <div className={classes.iconText}>
                  <BugReportTwoToneIcon color="secondary" />
                  {/* <Typography variant="subtitle1" color="secondary">
                    : {p.bugs.length}
                  </Typography> */}
                </div>
                <div className={classes.iconText}>
                  <PeopleAltTwoToneIcon color="secondary" />{' '}
                  <Typography variant="subtitle1" color="secondary">
                    : {p.assignee}
                  </Typography>
                </div>
              </div>
              <IncidentsMenu
                incidentId={p.id}
                assignee={p.assignee}
                isAdmin={p.createdBy.id === user?.id}
                title= {p.title}
                description={p.description}
                type={p.type}
                isResolved={p.isResolved}
                isAcknowledged={p.isAcknowledged}
                iconSize="default"
              />
            </div>
          </div>
          <Divider />
        </div>
      ))}
    </div>
  );
};

export default IncidentsListMobile;
