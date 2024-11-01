import { IEvent } from './interfaces/EventInterfaces';

export default class Event implements IEvent {
  occurredOn: Date;

  constructor(public readonly name: string) {
    this.occurredOn = new Date();
  }

  eventName(): string {
    return this.name;
  }
}
