/*
 * Script to parse Unicode emoji list and generate a JSON file
 * (This code is kinda messy, but it works. Don't blame me,
 * instead PR a cleaner version 😉)
 * Author: André Silveira
 * Date: 2022-01-04
 * License: MIT
 *
 * Emojis list follows this format:
 *
 * # group: group name
 * `code points; status # emoji name`
 *
 * Emoji status:
 *  - component
 *  - fully-qualified
 *  - minimally-qualified
 *  - unqualified
 *
 * In this list, we'll only work with fully-qualified and component emojis
 *
 * Example line:
 * # group: Smileys & Emotion
 * `1F636 200D 1F32B FE0F ; fully-qualified  # 😶‍🌫️ E13.1 face in clouds`
 *
 * HOW TO PROCESS THIS FILE:
 * - Remove comments but keep the group name
 * - Remove unecessary characters and emoji representation and change # to ;
 * E.g.: "1F636 200D 1F32B FE0F ; fully-qualified  ; face in clouds"
 * - Trim spaces
 * E.g.: "1F636-200D-1F32B-FE0F;fully-qualified;face_in_clouds"
 * - Remove minimally-qualified and unqualified emojis
 * - Split by semicolon
 * E.g.: ["1F636-200D-1F32B-FE0F", "fully-qualified", "face_in_clouds"]
 * - Convert Hexadecimal to UTF-16 surrogate pairs (basically, Hex pairs have
 * 5  or more characters and UTF-16 pairs have 4 or less characters)
 * E.g.: ["D83D DE36 200D D83C DF2B FE0F", "face_in_clouds"]
 * - Add emoji to the list, following the format:
 *    [
 *      {
 *        "code": "D83D DE36 200D D83C DF2B FE0F",
 *        "description": "face_in_clouds",
 *        "emoji": "😶‍🌫️"
 *      },
 *      {...}
 *    ]
 */

import { fromFileUrl, dirname } from "https://deno.land/std@0.119.0/path/mod.ts";

interface Emoji {
    code: string;
    description: string;
    emoji: string;
}

/* interface EmojiList {
    [key: string]: Emoji[];
} */

type EmojiList = Array<Emoji>;

/**
 * Converts a hexadecimal string to UTF-16 surrogate pair
 *
 * I've found this function on StackOverflow:
 * https://stackoverflow.com/questions/40155412/combining-es6-unicode-literals-with-es6-template-literals
 *
 * Credits to its author
 */
function toUTF16Pair(x: number) {
    return [
        ((((x - 0x10000) >> 0x0a) | 0x0) + 0xD800).toString(16),
        (((x - 0x10000) & 0x3FF) + 0xDC00).toString(16)
    ]
}

function parseEmojiList() {
    // Split by new line
    const lines = Deno.readTextFileSync(`${fromFileUrl(dirname(import.meta.url))}/emojis.json`).split("\n");
    // Remove comments but keep group names
    const withoutComm = lines
        /* .filter(line => line.startsWith("#"))
        .filter(line => !line.startsWith("# group:")) */
        .map(line => {
            if (line.startsWith("#")) {
                return line.startsWith("# group:")
                    ? line.substring(2)
                    : line.replace(/^#\s.*/, "");
            } else {
                return line;
            }
        })
        .filter(line => line.length > 0);
    // Remove unecessary characters and emoji representation and change # to ;
    const withoutChars = withoutComm
        .map(line => line
            .replace(/E\d{1,2}.\d{1,2}| {2,}|\p{So}+/gu, "")
            .replace(/#/g, ";").trim()
        );
    // Remove minimally-qualified and unqualified emojis
    const withoutUnq = withoutChars
        .filter(line => line.includes("fully-qualified")/*  || line.includes("component") */);
    // Split by semicolon
    const splitSc = withoutUnq
        .map(line => line.split(";").map(item => item.trim()));
    // Remove unknown characters from description
    const withoutUnknown = splitSc
        .map(line => line.map(item => item.replace(/[^a-zA-Z0-9"-’ ]| {2,}/gu, "").trim()));
    // Convert Hexadecimal to UTF-16 surrogate pairs
    const withUTF16 = withoutUnknown
        .map(line => {
            // First item is the code point
            const codePoint = line[0].split(' ');
            const parsed = codePoint.map(item => {
                if (item.length < 5) return item;
                const hex = toUTF16Pair(parseInt(item, 16));
                return hex.join(' ')
            });
            return [parsed.join(' ')].concat(line.slice(1));
        });
    // Add some details to description
    const withDetails = withUTF16
        .map(line => line.slice(0, 2)
        .concat(line[2].toString()
        .replace(/: /g, ":")
        .replace(/, /g, ",")
        .replace(/ {0,}skin tone/g, "")
        .replace(/\s+/g, "_")));

    // Add emoji to the list
    const emojiList: EmojiList = [];

    withDetails.forEach(line => {
        // const group = line[1] === 'fully-qualified' ? 'emojis' : 'components';
        const code = line[0];
        const description = line[2];

        emojiList.push({
            code,
            description,
            emoji: String.fromCharCode(...code.split(' ').map(item => parseInt(item, 16)))
        });
    });

    return emojiList;
}

Deno.writeFile(`${fromFileUrl(dirname(import.meta.url))}/emojis.json`, new TextEncoder().encode(JSON.stringify(parseEmojiList())));
