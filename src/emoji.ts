import emojis from "./emojidata.ts";

interface Emoji {
    name: string;
    emoji: string;
}

type EmojiList = typeof emojis;
// deno-lint-ignore ban-types
type EmojiName = keyof EmojiList | (string & {});

function getEmoji(name: EmojiName): Emoji | string {
    const emoji = emojis[name as keyof EmojiList];
    return emoji ? { name, emoji } : name;
}

export default getEmoji;
export type { Emoji, EmojiList, EmojiName };
