import {
  Context, Middleware, NextFunction
} from "./deps.deno.ts";
import getEmoji from "./emojis.ts";

interface ModuleOptions {
	fallbackStr: string;
}

export type EmojiFlavor<C extends Context> = C & {
    withEmoji: (name: TemplateStringsArray, ...emojis: string[]) => string;
};

function withEmoji(string: TemplateStringsArray, ...emojis: string[]) {
    return string.reduce((acc, str, index) => {
        const emoji = getEmoji(emojis[index]);
        return acc + str + (emoji ? `${emoji.emoji}` : "");
    }, "");
}

export function emojiParser<C extends EmojiFlavor<Context>>(options?: ModuleOptions): Middleware<C> {
  return async (ctx, next) => {
    ctx.withEmoji = withEmoji;
    await next();
  }
}

