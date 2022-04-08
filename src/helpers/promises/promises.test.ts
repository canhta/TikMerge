import { DateTime } from 'luxon';
import { batchPromises } from '.';

const handler = (i: number) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(i);
      resolve(i);
    }, 1000);
  });

const collection = Array.from(Array(100).keys());

const batchSize = 5;
(async () => {
  const startTime = DateTime.now();
  console.log(startTime.toFormat('HH:mm:ss.SSS'));
  const results = await batchPromises(batchSize, collection, handler);
  const endTime = DateTime.now();
  console.log(
    Math.floor(collection.length / batchSize),
    endTime.diff(startTime, ['milliseconds', 'seconds']).toObject()
  );
  console.log(results);
})();

// const os = require('os');
// const cpuCores = os.cpus();
// // Display system cpu cores
// console.log(cpuCores);
// console.log(cpuCores.length);
