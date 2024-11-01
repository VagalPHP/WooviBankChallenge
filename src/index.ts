import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import dotenv from 'dotenv';
import MongoDatabase from './database/MongoDatabase';
import EventBus from './domains/shared/EventBus/EventBus';
import EventEmitter from 'node:events';
import TransactionEvents from './domains/transaction/enums/TransactionEvents';
import { ITransaction } from './domains/transaction/entities/Transaction';
import TransactionApprovedEvent from './domains/transaction/events/TransactionApprovedEvent';
import TransactionDTO from './domains/transaction/dto/TransactionDTO';

dotenv.config();

const app = new Koa();

const eventBus = new EventBus();
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
  app.use(bodyParser()); // Middleware para analisar o corpo das requisições
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('============================================');
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log('============================================');
  });
};

init();
