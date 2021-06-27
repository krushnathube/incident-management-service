import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../../components/SearchBar';
import FormDialog from '../../components/FormDialog';
import IncidentForm from './IncidentForm';
import {
  filterIncidentsBy,
  selectIncidentsState,
} from '../../redux/slices/incidentsSlice';

import { useActionCardStyles } from '../../styles/muiStyles';
import AddIcon from '@material-ui/icons/Add';
import { IncidentFilterValues } from '../../redux/types';
import FilterBar from '../../components/FilterBar';

const menuItems = [
  { value: 'all', label: 'All' },
  { value: 'employee', label: 'Employee' },
  { value: 'property', label: 'Property' },
  { value: 'environment', label: 'Environment' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'fire', label: 'Fire' },
];

const IncidentsActionCard: React.FC<{
  filterValue: string;
  setFilterValue: (filterValue: string) => void;
  isMobile: boolean;
}> = ({ filterValue, setFilterValue, isMobile }) => {
  const classes = useActionCardStyles();
  const dispatch = useDispatch();
  const { filterBy } = useSelector(selectIncidentsState);

  const handleFilterChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue = e.target.value as IncidentFilterValues;
    dispatch(filterIncidentsBy(selectedValue));
  };

  return (
    <div>
      <div className={classes.inputs}>
        <div className={classes.searchBarWrapper}>
          <SearchBar
            searchValue={filterValue}
            setSearchValue={setFilterValue}
            label="Incidents"
            size={isMobile ? 'small' : 'medium'}
          />
        </div>
        <div className={classes.sortBarWrapper}>
          <FilterBar
            filterBy={filterBy}
            handleFilterChange={handleFilterChange}
            menuItems={menuItems}
            label="Incidents"
            size={isMobile ? 'small' : 'medium'}
          />
        </div>
      </div>
      <FormDialog
        triggerBtn={
          isMobile
            ? {
                type: 'fab',
                variant: 'extended',
                text: 'Incident',
                icon: AddIcon,
              }
            : {
                type: 'normal',
                text: 'Add Incident',
                icon: AddIcon,
                size: 'large',
              }
        }
        title="Add a new incident"
      >
        <IncidentForm />
      </FormDialog>
    </div>
  );
};

export default IncidentsActionCard;
