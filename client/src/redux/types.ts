export interface UserState {
  id: string;
  username: string;
  token: string;
}

export type IncidentType = 'employee' | 'environmental' | 'property' | 'vehicle' | 'fire';

export interface User {
  id: string;
  username: string;
}

export interface Note {
  id: number;
  bugId: string;
  body: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface IncidentState {
  id: string;
  title: string;
  assignee: User;
  description: string;
  type: IncidentType;
  notes: Note[];
  isResolved: boolean;
  isAcknowledged: boolean;
  createdBy: User;
  updatedBy?: User;
  closedBy?: User;
  acknowledgedBy?: User;
  closedAt?: Date;
  acknowledgedAt?: Date;
  updatedAt?: Date;
  createdAt: Date;
}

export type IncidentFilterValues = 
    'all' 
  | 'employee'
  | 'property'
  | 'environment'
  | 'vehicle'
  | 'fire'

export interface CredentialsPayload {
  username: string;
  password: string;
}

export interface IncidentPayload {
  incidentId?: string; 
  title: string;
  assigneeId: string;
  description: string;
  type: IncidentType;
}

export interface EditedIncidentData extends IncidentPayload {
  updatedAt: Date;
  updatedBy: User;
}

export interface ClosedAcknowledgedIncidentData {
  isResolved: boolean;
  isAcknowledged: boolean;
  closedAt: Date;
  closedBy: User;
  acknowledgedAt: Date;
  acknowledgedBy: User;
}

export interface NotifPayload {
  message: string;
  type: 'success' | 'error';
}
