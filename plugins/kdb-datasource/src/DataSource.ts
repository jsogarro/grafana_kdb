import defaults from 'lodash/defaults';

import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings } from '@grafana/data';

import { MyQuery, MyDataSourceOptions, defaultQuery } from './types';
import { MutableDataFrame, FieldType, DataFrame } from '@grafana/data';
import _ from 'lodash';
import moment from 'moment';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  basicAuth: string | undefined;
  withCredentials: boolean | undefined;
  url: string | undefined;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>, private backendSrv: any, private templateSrv: any) {
    super(instanceSettings);
    this.basicAuth = instanceSettings.basicAuth;
    this.withCredentials = instanceSettings.withCredentials;
    this.url = instanceSettings.url;
  }

  private request(data: string) {
    const options: any = {
      url: this.url,
      method: 'POST',
      // TODO: change this to a format that kdb expects
      data: {
        query: data,
      },
    };

    if (this.basicAuth || this.withCredentials) {
      options.withCredentials = true;
    }
    if (this.basicAuth) {
      options.headers = {
        Authorization: this.basicAuth,
      };
    }

    return this.backendSrv.datasourceRequest(options);
  }

  private postQuery(query: string) {
    return this.request(query)
      .then((results: any) => {
        return results;
      })
      .catch((err: any) => {
        if (err.data && err.data.error) {
          throw {
            message: 'GraphQL error: ' + err.data.error.reason,
            error: err.data.error,
          };
        }

        throw err;
      });
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    return Promise.all(
      options.targets.map(target => {
        const query = defaults(target, defaultQuery);
        let payload = query.queryText;

        // TODO: figure out why this errors out
        // const to = options.range.to.valueOf().toString(;
        // const from = options.range.from.valueOf().toString();

        const to = '';
        const from = '';

        payload = payload.replace(/\$timeFrom/g, to);
        payload = payload.replace(/\$timeTo/g, from);
        payload = this.templateSrv.replace(payload, options.scopedVars);

        console.log(payload);

        return this.postQuery(payload);
      })
    ).then((results: any) => {
      console.log('RESULTS: ', results);

      const dataFrame: DataFrame[] = [];
      for (const res of results) {
        const data = res.data.data.data;
        const docs: any[] = [];
        const fields: any[] = [];
        for (let i = 0; i < data.length; i++) {
          for (const p in data[i]) {
            if (fields.indexOf(p) === -1) {
              fields.push(p);
            }
          }
          docs.push(data[i]);
        }

        const df = new MutableDataFrame({
          fields: [],
        });
        for (const f of fields) {
          let t: FieldType = FieldType.string;
          if (f === 'Time') {
            t = FieldType.time;
          } else if (_.isNumber(docs[0][f])) {
            t = FieldType.number;
          }
          df.addField({
            name: f,
            type: t,
          }).parse = (v: any) => {
            return v || '';
          };
        }
        for (const doc of docs) {
          if (doc.Time) {
            doc.Time = moment(doc.Time);
          }
          df.add(doc);
        }
        dataFrame.push(df);
      }
      return { data: dataFrame };
    });
  }

  testDatasource() {
    const q = `{
      __schema{
        queryType{name}
      }
    }`;
    return this.postQuery(q).then(
      (res: any) => {
        if (res.errors) {
          console.log(res.errors);
          return {
            status: 'error',
            message: 'kdb Error: ' + res.errors[0].message,
          };
        }
        return {
          status: 'success',
          message: 'Success',
        };
      },
      (err: any) => {
        console.log(err);
        return {
          status: 'error',
          message: 'HTTP Response ' + err.status + ': ' + err.statusText,
        };
      }
    );
  }
}
