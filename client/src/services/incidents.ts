import axios from 'axios';
import backendUrl from '../backendUrl';
import { setConfig } from './auth';
import { IncidentPayload } from '../redux/types';

const baseUrl = `${backendUrl}/incidents`;

const getIncidents = async () => {
  const response = await axios.get(baseUrl, setConfig());
  return response.data;
};

const createIncident = async (incidentData: IncidentPayload) => {
  const response = await axios.post(baseUrl, incidentData, setConfig());
  return response.data;
};

const deleteIncident = async (incidentId: string) => {
  const response = await axios.delete(`${baseUrl}/${incidentId}`, setConfig());
  return response.data;
};

const editIncidentTitle = async (incidentId: string, newTitle: string) => {
  const response = await axios.put(
    `${baseUrl}/${incidentId}`,
    { title: newTitle },
    setConfig()
  );
  return response.data;
};

const closeIncident = async (incidentId: string) => {
  const response = await axios.post(
    `${baseUrl}/${incidentId}/close`,
    null,
    setConfig()
  );
  return response.data;
};

const reopenIncident = async (incidentId: string) => {
  const response = await axios.post(
    `${baseUrl}/${incidentId}/acknowledge`,
    null,
    setConfig()
  );
  return response.data;
};

const incidentService = {
  getIncidents,
  createIncident,
  deleteIncident,
  editIncidentTitle,
  closeIncident,
  reopenIncident,
};

export default incidentService;
