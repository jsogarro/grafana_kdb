/ File used to see a simple trade table for testing purposes

createTrade:{
  trade:([]date:();sym:();qty:());
}

seedTradeTable: {
  `trade insert (2019.12.10;`MSFT;200);
  `trade insert (2019.12.10;`GOOGL;1300);
  `trade insert (2019.12.10;`AMZN;1750);
}

main:{
  / createTrade[];
  seedTradeTable[];

  exit 0;
 };

/start script
@[main;`;{0N!"Error running main: ",x;exit 1}];