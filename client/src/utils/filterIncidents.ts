import { IncidentState, IncidentFilterValues } from '../redux/types';

const filterIncidents = (incidents: IncidentState[], filterBy: IncidentFilterValues) => {
  switch (filterBy) {    
    case 'all':
      return incidents;
    case 'employee':
    case 'property':
    case 'environment':
    case 'vehicle':
    case 'fire':
      return incidents.filter((i) => i.type === filterBy);
    
  }
};

export default filterIncidents;
