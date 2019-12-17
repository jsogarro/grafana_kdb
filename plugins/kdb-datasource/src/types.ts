import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  queryText: string;
  dataPath: string;
  constant: number;
}

export const defaultQuery: Partial<MyQuery> = {
  queryText: `select 10# from prices`,
  dataPath: 'data.submissions',
  constant: 6.5,
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  apiKey?: string;
}
