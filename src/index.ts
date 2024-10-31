import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import dotenv from 'dotenv';
import MongoDatabase from './database/MongoDatabase';

dotenv.config();

const app = new Koa();
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
