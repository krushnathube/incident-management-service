import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IncidentState } from '../../redux/types';
import { selectAuthState } from '../../redux/slices/authSlice';
import IncidentsMenu from './IncidentsMenu';
import { formatDateTime, truncateString } from '../../utils/helperFuncs';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  Paper,
} from '@material-ui/core';
import { useTableStyles } from '../../styles/muiStyles';
import { typeStyles, statusStyles } from '../../styles/customStyles';

const tableHeaders = [
  'Title',
  'Assigned To', 
  'Admin', 
  'Type',
  'Status',
  'Added',
  'Updated',
  'Notes',
  'Actions',
];

const IncidentsTable: React.FC<{ incidents: IncidentState[] }> = ({
  incidents,
}) => {
  const classes = useTableStyles();
  const history = useHistory();
  const { user } = useSelector(selectAuthState);

  return (
    <Paper className={classes.table}>
      <Table>
        <TableHead>
          <TableRow>
            {tableHeaders.map((t) => (
              <TableCell key={t} align="center">
                {t}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {incidents.map((p) => (
            <TableRow key={p.id}>
              <TableCell
                onClick={() => history.push(`/incidents/${p.id}`)}
                className={classes.clickableCell}
                align="center"
              >
                <Link
                  component={RouterLink}
                  to={`/incidents/${p.id}`}
                  color="secondary"
                >
                  {truncateString(p.title, 30)}
                </Link>
              </TableCell>
              <TableCell align="center">{p.assignee.username}</TableCell>
              <TableCell align="center">{p.createdBy.username}</TableCell>
              <TableCell align="center">
                <div
                  style={{
                    ...typeStyles(p.type),
                    textTransform: 'capitalize',
                    margin: '0 auto',
                  }}
                >
                  {p.type}
                </div>
              </TableCell>
              <TableCell align="center">
                <div
                  style={{
                    ...statusStyles(p.isAcknowledged, p.isResolved),
                    margin: '0 auto',
                  }}
                >
                  {p.isAcknowledged && !p.isResolved ? 'Acknowledged' : p.isResolved ? 'Closed' : 'Open'}
                </div>
              </TableCell>
              <TableCell align="center">
                {formatDateTime(p.createdAt)} ~ {p.createdBy.username}
              </TableCell>
              <TableCell align="center">
                {!p.updatedAt || !p.updatedBy
                  ? 'n/a'
                  : `${formatDateTime(p.updatedAt)} ~ ${p.updatedBy.username}`}
              </TableCell>
              <TableCell align="center">{p.notes.length}</TableCell>
              <TableCell align="center">
                <IncidentsMenu
                  incidentId={p.id}
                  assignee={p.assignee}
                  isAdmin={p.createdBy.id === user?.id}
                  title= {p.title}
                  description={p.description}
                  type={p.type}
                  isResolved={p.isResolved}
                  isAcknowledged={p.isAcknowledged}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default IncidentsTable;
