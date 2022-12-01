import { parseError } from "@baby-stats/lib/error";

interface QueueItem<T> {
  promise: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
}

export default class Queue<T> {
  queue: QueueItem<T>[] = [];
  pending = false;

  enqueue(promise: () => Promise<T>) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        promise,
        resolve,
        reject,
      });
      this.dequeue();
    });
  }

  dequeue() {
    if (this.pending) {
      return false;
    }
    const item = this.queue.shift();
    if (!item) {
      return false;
    }
    try {
      this.pending = true;
      item
        .promise()
        .then((value) => {
          this.pending = false;
          item.resolve(value);
          this.dequeue();
        })
        .catch((err) => {
          this.pending = false;
          item.reject(err);
          this.dequeue();
        });
    } catch (err) {
      this.pending = false;
      item.reject(parseError(err));
      this.dequeue();
    }
    return true;
  }
}
