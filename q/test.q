/command line args
d:first each .Q.def[enlist[`name]!enlist enlist "Joe"] .Q.opt .z.x;
/variable definitions
currentTime:.z.t;
/function definitions
sayhello:{0N!"Hello ",x};
telltime:{0N!"It is currently ",string x};

/main function call
main:{
  sayhello d[`name];
  telltime currentTime;
  exit 0;
 };

/start script
@[main;`;{0N!"Error running main: ",x;exit 1}];