import { Options, LocalsObject, compileFile, compileTemplate } from 'pug';
import { Middleware } from 'koa';

declare module 'koa' {
    interface BaseContext {
        render: (view: string, locals?: LocalsObject, options?: RenderOptions) => Promise<void>;
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
        const filename = view.endsWith('.pug') ? view : `${view}.pug`;
        const reanderOptions = { ...defaultOptions, ...options, filename};

        if (!views.has(filename)) {
            const cache = false;
            const fn = compileFile(filename, { ...reanderOptions, cache });

            if (!reanderOptions.cache) {
                return fn;
            }

            views.set(filename, fn);
        }

        return views.get(filename) as compileTemplate;
    }

    return async (ctx, next) => {
        const defaultLocals = defaultOptions.locals || {};

        // Set custom local variables
        ctx.setLocal = (key: string, value: any) => {
            defaultLocals[key] = value;
        };

        // Add render method to context
        ctx.render = async (view: string, locals?: LocalsObject, options?: RenderOptions) => {
            const fn = getView(view, options);
            ctx.body = fn({ ...defaultLocals, ...locals });
        };

        await next();
    };
}