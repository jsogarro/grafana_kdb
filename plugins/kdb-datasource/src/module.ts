import { DataSourcePlugin } from '@grafana/data';
// import { DataSource } from './DataSource';
import { SimpleJsonDataSource } from './SimpleJsonDataSource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './QueryEditor';
import { MyQuery, MyDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<SimpleJsonDataSource, MyQuery, MyDataSourceOptions>(SimpleJsonDataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
