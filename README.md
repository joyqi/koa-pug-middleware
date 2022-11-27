# koa-pug-middleware

This is a Koa middleware wrapper for [pug](https://pugjs.org/) template engine.

Compare to [koa-pug](https://www.npmjs.com/package/koa-pug), this middleware has the following features:

1. Support `koa@2` only.
2. Support `pug@3` only.
3. Use `app.use(pug())` to mount the middleware, instead of creating a new instance.
4. Add `context.setLocal` method to set Pug locals for the current request. So you can use `this.setLocal` in your middleware to set locals for the next middleware.

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