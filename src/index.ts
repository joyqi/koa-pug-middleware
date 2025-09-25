import { Options, LocalsObject, compileFile, compileTemplate } from 'pug';
import { Middleware } from 'koa';
import { resolve } from 'path';

declare module 'koa' {
    interface BaseContext {
        render: (view: string, locals?: LocalsObject, options?: RenderOptions) => void;
        setLocal: (key: string, value: any) => void;
    }
}

type DefaultOptions = Omit<Options, 'filename'> & { locals?: LocalsObject };
type RenderOptions = Omit<DefaultOptions, 'locals'>;

export default function pug(defaultOptions: DefaultOptions): Middleware {
    const views = new Map<string, compileTemplate>();

    // Compile the template and cache it
    // We use custom cache because pug's cache is not exposed
    function getView(view: string, options?: RenderOptions) {
        const renderOptions = { ...defaultOptions, ...options};
        const filename = resolve(renderOptions.basedir || '.', view.endsWith('.pug') ? view : `${view}.pug`);

        if (!views.has(filename)) {
            const cache = false;
            const fn = compileFile(filename, { ...renderOptions, filename, cache });

            if (!renderOptions.cache) {
                return fn;
            }

            views.set(filename, fn);
        }

        return views.get(filename) as compileTemplate;
    }

    return async (ctx, next) => {
        const defaultLocals = defaultOptions.locals || {};
        const customLocals: LocalsObject = {};
        let renderer: (() => void) | undefined;

        // Set custom local variables
        ctx.setLocal = (key: string, value: any) => {
            customLocals[key] = value;
        };

        // Add render method to context
        ctx.render = (view: string, locals?: LocalsObject, options?: RenderOptions) => {
            renderer = () => {
                const fn = getView(view, options);
                ctx.body = fn({ ...defaultLocals, ...customLocals, ...locals });
            };
        };

        await next();

        if (renderer) {
            if (ctx.body != null) {
                throw new Error('ctx.body is already set');
            }

            if (ctx.headersSent) {
                throw new Error('Headers have already been sent');
            }

            renderer();
        }
    };
}