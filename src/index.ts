import Koa from 'koa';
import dotenv from 'dotenv';
import MongoDatabase from './database/MongoDatabase';
import EventBus from './domains/shared/EventBus/EventBus';
import EventEmitter from 'node:events';
import TransactionEvents from './domains/shared/events/transaction/enums/TransactionEvents';
import { ITransaction } from './domains/transaction/entities/Transaction';
import TransactionApprovedEvent from './domains/shared/events/transaction/TransactionApprovedEvent';
import TransactionDTO from './domains/transaction/dto/TransactionDTO';
import { UpdateAccountHandler } from './domains/account/event-handlers/UpdateAccountHandler';

dotenv.config();

const app = new Koa();

const eventBus = new EventBus();

// DOMAIN EVENTS SUBSCRIPTION
eventBus.subscribe(new UpdateAccountHandler());

// APPLICATION EVENTS AND DOMAIN EVENTS EMISSION
const eventEmitter = new EventEmitter();
eventEmitter.on(
  TransactionEvents.TRANSACTION_APPROVED,
  (transaction: ITransaction) => {
    const transactionDTO: TransactionDTO =
      TransactionDTO.fromTransaction(transaction);
    eventBus.publish(
      new TransactionApprovedEvent(transactionDTO.toApprovedEvent()),
    );
  },
);

const init = async () => {
  await MongoDatabase.connectDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('============================================');
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log('============================================');
  });
};

init();
