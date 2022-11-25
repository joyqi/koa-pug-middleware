# koa-pug-middleware

This is a Koa middleware wrapper for [pug](https://pugjs.org/) template engine.

## Installation

```bash
npm install -s koa-pug-middleware
```

## Usage

```typescript
import * as Koa from 'koa';
import * as pug from 'koa-pug-middleware';

const app = new Koa();

app.use(pug({
  debug: false,
  pretty: false,
  compileDebug: false,
  locals: {
    globalFoo: 'bar'  // You can set default locals here
  },
  basedir: './views'
}));

app.use(async (ctx) => {
  ctx.setLocal('foo', 'bar');  // You can set locals here
});

app.use(async (ctx) => {
  await ctx.render('index', {
    foo: 'bar'  // You can set locals here
  });
});
```