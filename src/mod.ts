import { Context, Message, Middleware } from "./deps.deno.ts";
import getEmoji from "./emoji.ts";
import type { EmojiName } from "./emoji.ts";

export type EmojiFlavor<C extends Context> = Flavor & C;
interface Flavor {
    /**
     * You can use this method to parse a string with emojis.
     *
     * Keep in mind that you need to use this method with a template string.
     *
     * Examples:
     * ```ts
     * const text = ctx.emoji`LOL ${'face_with_tears_of_joy'}!`; // => "LOL 😂!"
     * await ctx.reply(ctx.emoji`This is an example! ${'smiling_face_with_halo'}`); // => "This is an example! 😇"
     * ```
     */
    emoji: (name: TemplateStringsArray, ...emojis: EmojiName[]) => string;
    /**
     * You can use this method to directly reply to a message
     * with emojis parsing.
     *
     * Keep in mind that you need to use this method with a template string.
     *
     * Examples:
     * ```ts
     * await ctx.replyWithEmoji`This is an example! ${'smiling_face_with_halo'}`; // => "This is an example! 😇"
     * ```
     */
    replyWithEmoji: (
        string: TemplateStringsArray,
        ...emojis: EmojiName[]
    ) => Promise<Message.TextMessage>;
}

function withEmoji(string: TemplateStringsArray, ...emojis: EmojiName[]) {
    return string.reduce((acc, str, index) => {
        const emoji = getEmoji(emojis[index]);
        return acc + str + (emoji ? emoji.emoji : "");
    }, "");
}

export function emojiParser<C extends Context & Flavor>(): Middleware<C> {
    return async (ctx, next) => {
        ctx.emoji = withEmoji;
        ctx.replyWithEmoji = (
            text: TemplateStringsArray,
            ...emojis: EmojiName[]
        ): ReturnType<typeof ctx.reply> => {
            return ctx.reply(withEmoji(text, ...emojis));
        };
        await next();
    };
}

export function emoji(name: EmojiName): string {
    return getEmoji(name)?.emoji ?? "";
}
