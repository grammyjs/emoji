import {
  Context, Middleware
} from "./deps.deno.ts";
import getEmoji from "./emojis.ts";

export type EmojiFlavor<C extends Context> = C & {
    emoji: (name: TemplateStringsArray, ...emojis: string[]) => string;
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
    ctx.replyWithEmoji = async (text: TemplateStringsArray, ...emojis: string[]) => {
        return await ctx.reply(withEmoji(text, ...emojis));
    }
    await next();
  }
}

