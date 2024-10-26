// shared/SimpleEventBus.ts
import { IEventBus } from './IEventBus';
import { IDomainEvent } from './IDomainEvent';

export class EventBus implements IEventBus {
  private handlers: { [eventName: string]: Function[] } = {};

  // Publica um evento e notifica todos os handlers
  publish(event: IDomainEvent): void {
    const eventName = event.constructor.name;
    const eventHandlers = this.handlers[eventName] || [];
    eventHandlers.forEach((handler) => handler(event));
  }

  // Registra um handler para um evento específico
  subscribe(eventName: string, handler: Function): void {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);
  }
}
