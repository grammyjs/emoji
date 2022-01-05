import { fromFileUrl, dirname } from "https://deno.land/std@0.119.0/path/mod.ts";

// You should download the latest version of this file from:
// https://github.com/desktop-app/lib_ui/blob/633648074a25d0d1b3524b71a63842c22894176b/emoji_suggestions/emoji_autocomplete.json
// or a more recent version of this file from their github repo.
import tgemojis from './emoji-autocomplete.json' assert { type: 'json' };

type EmojisCodes = keyof typeof tgemojis;

interface OutputEmoji {
    code: string;
    alias: string;
    emoji: string;
    name: string;
}

interface EmojisList {
    [key: string]: OutputEmoji;
}

function toUTF16Pair(x: number) {
    return [
        ((((x - 0x10000) >> 0x0a) | 0x0) + 0xD800).toString(16),
        (((x - 0x10000) & 0x3FF) + 0xDC00).toString(16)
    ]
}

function parseTgEmojis() {
    const emojisList: EmojisList = {};

    Object.keys(tgemojis).forEach((key) => {
        const emoji = tgemojis[key as EmojisCodes];

        const formattedEmoji = emoji.output.split('-').map((code) => (code.length > 4)
            ? String.fromCharCode(...toUTF16Pair(parseInt(code, 16)).map(pair => parseInt(pair, 16)))
            : String.fromCharCode(parseInt(code, 16))).join('');

        const alphaCodeWithToneReplace = emoji.alpha_code
            .replace(/_tone1/g, ':light')
            .replace(/_tone2/g, ':medium-light')
            .replace(/_tone3/g, ':medium')
            .replace(/_tone4/g, ':medium-dark')
            .replace(/_tone5/g, ':dark');

        emojisList[alphaCodeWithToneReplace.replace(/^:|:$/g, '')] = {
            code: emoji.output,
            alias: emoji.aliases,
            emoji: formattedEmoji,
            name: emoji.name
        }
    });

    return emojisList;
}

Deno.writeFile(`${fromFileUrl(dirname(import.meta.url))}/tg-emojis.json`, new TextEncoder().encode(JSON.stringify(parseTgEmojis())));
