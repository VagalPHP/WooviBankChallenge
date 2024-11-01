export interface IEvent {
  occurredOn: Date;

  eventName(): string;
}

export interface IEventBus {
  publish(event: IEvent): void;

  subscribe(handler: IEventHandler<IEvent>): void;
}

export interface IEventHandler<T extends IEvent> {
  handle(event: T): void;

  subscribedTo(): string;
}
