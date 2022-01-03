import emojis from "./emojis.json" assert { type: "json" };

interface Emoji {
    name: string;
    emoji: string;
}

type EmojiList = typeof emojis;
type EmojiName = keyof EmojiList;

function getEmoji(name: EmojiName): Emoji | undefined {
    const emoji = emojis[name];
    return emoji ? { name, emoji } : undefined;
}

export default getEmoji;
export type { Emoji, EmojiList, EmojiName };
