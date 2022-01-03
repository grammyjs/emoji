import { ld as _ } from "https://deno.land/x/deno_lodash/mod.ts";
import emojisList from "./emojis.json" assert { type: "json" };

interface Emoji {
  name: string;
  emoji: string;
}

interface EmojisList {
  [key: string]: string;
}

const emojis: EmojisList = JSON.parse(JSON.stringify(emojisList));

function getEmoji(name: string): Emoji | undefined {
  const emojiName = Object.keys(emojis).find((key) => emojis[key] === emojis[name]);
  const emojiValue = emojis[name];
  return emojiName ? { name: emojiName, emoji: emojiValue } : undefined;
}

export default getEmoji;
export type {
  Emoji,
  EmojisList
}
