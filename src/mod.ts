import { Context, NextFunction } from "./deps.deno.ts";
import emojis from "./emojidata.ts";

type EmojiList = typeof emojis;
type EmojiName = keyof EmojiList | (string & Record<never, never>);

export type EmojiFlavor<C extends Context = Context> = C & {
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
    ) => ReturnType<C["reply"]>;
};

const getEmoji = (name: EmojiName) => emojis[name as keyof EmojiList] || name;
const withEmoji = (text: TemplateStringsArray, ...emojis: EmojiName[]) => {
    return text.reduce((acc, str, idx) => {
        return acc + str + getEmoji(emojis[idx] || "");
    }, "");
};
export const emojiParser = <C extends EmojiFlavor>() => {
    return async (ctx: C, next: NextFunction) => {
        ctx.emoji = withEmoji;
        ctx.replyWithEmoji = (
            text: TemplateStringsArray,
            ...emojis: EmojiName[]
        ) => ctx.reply(withEmoji(text, ...emojis));
        await next();
    };
};
export const emoji = (name: EmojiName) => getEmoji(name);
