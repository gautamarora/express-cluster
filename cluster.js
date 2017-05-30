'use strict';

var cluster = require('cluster');

if(cluster.isMaster) {
  var cpuCount;
  if(process.env.NODE_CLUSTER_WORKERS) {
    cpuCount = process.env.NODE_CLUSTER_WORKERS;
  } else {
    cpuCount = require('os').cpus().length;
  }

  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
  cluster.on('online', function(worker) {
    console.log('Worker #%d (%d) is online', worker.id, worker.process.pid);
  });
  cluster.on('exit', function (worker) {
    console.log('Worker #%d (%d) is offline!', worker.id, worker.process.pid);
    cluster.fork();
  });
} else {
  require('./www');
}