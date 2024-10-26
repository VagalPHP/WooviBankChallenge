import { IDomainEvent } from './IDomainEvent';

export interface IEventBus {
  publish(event: IDomainEvent): void;
  subscribe(eventName: string, handler: Function): void;
}
