# koa-pug-middleware

This is a Koa middleware wrapper for [Pug](https://pugjs.org/) template engine.

Compare to [koa-pug](https://www.npmjs.com/package/koa-pug), this middleware has the following features:

1. More elegant API, no need to pass `app` to `Pug` constructor.
2. Follows KISS principle, keep more things to Pug.
3. Support `koa@2` only.
4. Support `pug@3` only.
5. Add `context.setLocal` method, so you can set locals in middleware.

## Installation

```bash
npm install -s koa-pug-middleware
```

## Usage

### Mount the middleware

Use [Pug](https://pugjs.org/api/reference.html) options to initialize the middleware:

```typescript
import * as Koa from 'koa';
import * as pug from 'koa-pug-middleware';

const app = new Koa();

app.use(pug({
  debug: false,
  cache: true,        // NOTE: set to false in development
  pretty: false,
  compileDebug: false,
  locals: {
    globalFoo: 'bar'  // You can set global locals here
  },
  basedir: './views'
}));
```

### `context.setLocal(key, value)`

Parameters:

- `key` - The key of the local variable.
- `value` - The value of the local variable.

```typescript
app.use(async (ctx) => {
  ctx.setLocal('foo', 'bar');  // You can set locals here
});
```

### `context.render(view, locals, options?)`

Parameters:

- `view` - The path of the view file. Relative to the `basedir` option. You can omit the extension name.
- `locals` - The locals for the view.
- `options` - The options for the view. See [Pug options](https://pugjs.org/api/reference.html#options). Will override the options in the middleware.

```typescript
app.use(async (ctx) => {
  await ctx.render('index', {
    foo: 'bar'  // You can set locals here
  });
});
```