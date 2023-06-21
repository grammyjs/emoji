import { Context, NextFunction } from "./deps.deno.ts";
import getEmoji from "./emoji.ts";
import type { EmojiName } from "./emoji.ts";

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

function withEmoji(string: TemplateStringsArray, ...emojis: EmojiName[]) {
    return string.reduce((acc, str, index) => {
        // The number of elements in `string` is 1 more than in `emojis`, therefore
        // we will be looking for an `undefined` emoji, which does not make sense,
        // so we exit the loop early.
        if (index === string.length - 1) return acc + str;
        const emoji = getEmoji(emojis[index]);
        return acc + str + (typeof emoji === "string" ? emoji : emoji.emoji);
    }, "");
}

export function emojiParser<C extends EmojiFlavor>() {
    return async (ctx: C, next: NextFunction) => {
        ctx.emoji = withEmoji;
        ctx.replyWithEmoji = (
            text: TemplateStringsArray,
            ...emojis: EmojiName[]
        ) => ctx.reply(withEmoji(text, ...emojis));
        await next();
    };
}

export function emoji(name: EmojiName): string {
    const emoji = getEmoji(name);
    // `emoji` will be `name` if an emoji with that name doesn't exist.
    return typeof emoji === "string" ? emoji : emoji.emoji;
}
