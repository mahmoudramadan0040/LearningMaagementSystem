import { Includeable } from 'sequelize';

export interface ReportRelation {
  model: any; // model class (e.g. Student)
  as?: string; // optional alias if you used `as` in associations
  attributes?: string[];
  required?: boolean;
  include?: Includeable[]; // nested includes
}

export interface ReportConfig {
  name: string; // unique report key (used in registry / routes)
  model: any; // primary model (e.g. Grade)
  columns?: string[]; // attributes from primary model
  relations?: ReportRelation[]; // relations to include
  allowedFilters?: string[]; // allowed filter keys (e.g. ['studentId','subjectId'])
  defaultOrder?: [string, 'ASC' | 'DESC'] | null;
}
