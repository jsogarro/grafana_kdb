/ Webserver

/ Expose port 5001
\p 5001i

/ Variables
.gkdb.tab:([]time:.z.p;qry:enlist "starting table");
.gkdb.timeCol:`time;
.gkdb.types:(`short$til[20])!`array`boolean,#[3;`null],#[5;`number],#[10;`string];
.gkdb.epoch:946684800000;
.gkdb.sym:`sym

/ Websockets
.z.ws:{neg[.z.w].Q.s @[value;x;{`$ "'",x}]}

/ HTTP
.z.ph:{:"HTTP/1.x 200 OK\r\nContent- Type:application/json\r\n\r\n", .j.j table_data }
/ .z.pm{:`OPTIONS;requestText;requestHeaderDict}
z.pp:{
    r: " " vs first x;

    rqt:.j.k r 1;

    rqtype:raze rqt[`targets]`type;
    `.gkdb.tab upsert(.z.p;raze rqt[`targets]`target);

    colName:cols rqt;
    colType:.gkdb.types type each rqt colName;

    :.h.hy[`json] .j.j enlist`columns`rows`type!(flip`text`type!(colName;colType);value'[rqt]til count rqt;`table);
 }
