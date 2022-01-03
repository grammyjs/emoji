import {
  Context, Middleware, Message
} from "./deps.deno.ts";
import getEmoji from "./emojis.ts";

export type EmojiFlavor<C extends Context> = C & {
    /**
     * You can use this method to parse a string with emojis.
     *
     * Keep in mind that you need to use this method with a template string.
     *
     * Examples:
     * ```ts
     * const text = ctx.emoji`LOL ${'joy'}!`; // => "LOL 😂!"
     * ctx.reply(ctx.emoji`This is an example! ${'innocent'}`); // => "This is an example! 😇"
     * ```
     */
    emoji: (name: TemplateStringsArray, ...emojis: string[]) => string;
    /**
     * You can use this method to directly reply to a message
     * with emojis parsing.
     *
     * Keep in mind that you need to use this method with a template string.
     *
     * Examples:
     * ```ts
     * ctx.replyWithEmoji`This is an example! ${'innocent'}`; // => "This is an example! 😇"
     * ```
     */
    replyWithEmoji: (string: TemplateStringsArray, ...emojis: string[]) => void;
};

function withEmoji(string: TemplateStringsArray, ...emojis: string[]) {
    return string.reduce((acc, str, index) => {
        const emoji = getEmoji(emojis[index]);
        return acc + str + (emoji ? `${emoji.emoji}` : "");
    }, "");
}

export function emojiParser<C extends EmojiFlavor<Context>>(): Middleware<C> {
  return async (ctx, next) => {
    ctx.emoji = withEmoji;
    ctx.replyWithEmoji = (text: TemplateStringsArray, ...emojis: string[]): Promise<Message.TextMessage> => {
        return ctx.reply(withEmoji(text, ...emojis));
    }
    await next();
  }
}

