import emojis from "./emojis/emojis.json" assert { type: "json" };

interface Emoji {
    name: string;
    emoji: string;
}

// TODO: Needs fix
type EmojiList = typeof emojis;
type EmojiName = keyof EmojiList;

// TODO: Needs fix
function getEmoji(name: EmojiName): Emoji | undefined {
    const emoji = emojis.find(e => e.description === name);
    return emoji ? { name: emoji.description, emoji: emoji.emoji } : undefined;
}

export default getEmoji;
export type { Emoji, EmojiList, EmojiName };
