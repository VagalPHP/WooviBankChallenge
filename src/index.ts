import Application from 'koa';

const app = new Application();

app.use((context) => {
  context.body = 'Hello World';
});

app.listen(3000);
