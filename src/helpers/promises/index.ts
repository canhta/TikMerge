type Promisable<T> = T | Promise<T>;

type Callback<T, U> = (item: T) => Promisable<U>;

export function batchPromises<T, U>(
  batchSize: number,
  collection: Promisable<T[]>,
  callback: Callback<T, U>
): Promise<U[]> {
  return Promise.resolve(collection).then((arr) =>
    arr
      .map((_, i) => (i % batchSize ? [] : arr.slice(i, i + batchSize)))
      .map((group) => (res: any) => Promise.all(group.map(callback)).then((r) => res.concat(r)))
      .reduce((chain, work) => chain.then(work), Promise.resolve([]))
  );
}
