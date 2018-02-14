interface Subscriber {
  handleMessage(message: string, publisher: any, data: any): any;
}

const _subscribers: {
  [message: string]: Subscriber[];
} = {};

const w = window as any;

w.publish = (message: string, publisher: any, data: any) => {
  const subscribers = _subscribers[message] || [];
  subscribers.forEach(subscriber => {
    subscriber.handleMessage(message, publisher, data);
  });
};

w.subscribe = (message: string, subscriber: Subscriber) => {
  if (!(message in _subscribers)) {
    _subscribers[message] = [];
  }
  _subscribers[message].push(subscriber);
};

w.unsubscribe = (message: string, subscriber: Subscriber) => {
  const index = _subscribers[message].indexOf(subscriber);
  _subscribers[message].splice(index, 1);
};
