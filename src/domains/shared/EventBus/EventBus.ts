import { IEvent, IEventBus, IEventHandler } from './interfaces/EventInterfaces';

export default class EventBus implements IEventBus {
  private static instance: EventBus;
  private handlers: { [eventName: string]: IEventHandler<IEvent>[] } = {};

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public publish(event: IEvent): void {
    const eventName = event.eventName();
    const handlers = this.handlers[eventName] || [];

    handlers.forEach((handler) => {
      handler.handle(event);
    });
  }

  public subscribe(handler: IEventHandler<IEvent>): void {
    const eventName = handler.subscribedTo();

    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }

    this.handlers[eventName].push(handler);
  }
}
