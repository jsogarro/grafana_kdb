import defaults from 'lodash/defaults';

import React, { PureComponent, ChangeEvent } from 'react';
import { QueryEditorProps } from '@grafana/data';
import { SimpleJsonDataSource } from './SimpleJsonDataSource';
import { MyQuery, MyDataSourceOptions, defaultQuery } from './types';

type Props = QueryEditorProps<SimpleJsonDataSource, MyQuery, MyDataSourceOptions>;

interface State {
  target: any;
  type: any;
  query: string;
}

export class QueryEditor extends PureComponent<Props, State> {
  onComponentDidMount() {}

  onQueryTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, queryText: event.target.value });
  };

  onConstantChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, constant: parseFloat(event.target.value) });
    onRunQuery(); // executes the query
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { queryText } = query;

    return (
      <>
        <section className="grafana-metric-options">
          <div className="gf-form"></div>
        </section>

        <div>
          <div className="gf-form-inline">
            <div className="gf-form max-width-8">
              <select className="gf-form-input" ng-model="ctrl.target.type" ng-options="f as f for f in ['table', 'timeserie']">
                <option>table</option>
                <option>timeserie</option>
              </select>
            </div>
            <div className="gf-form" ng-if="ctrl.target.rawQuery">
              <textarea className="gf-form-input" rows={5} ng-model="ctrl.target.target" ng-blur="ctrl.onChangeInternal()" />
            </div>

            <div className="gf-form gf-form--grow">
              <div className="gf-form-label gf-form-label--grow"></div>
            </div>
          </div>
        </div>
        <textarea value={queryText || ''} onChange={this.onQueryTextChange} className="gf-form-input" rows={10} />
      </>
    );
  }
}
