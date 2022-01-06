import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const emojis: { [name: string]: string } = {};
let ts = `export default {`;

const getEmojiPaths = async (): Promise<string[]> => {
    const response = await fetch("https://emojipedia.org/apple/");
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html")!;
    const paths: string[] = [];

    const list = doc
        .getElementsByClassName("emoji-grid")[0]
        .getElementsByTagName("li");

    for (const emoji of list) {
        const path = emoji.getElementsByTagName("a")[0].attributes.href;
        paths.push(path.substring(1, path.length - 1));
    }

    return paths;
};

const fetchEmojis = async () => {
    console.log("Fetching emoji list...");
    const emojiPaths = await getEmojiPaths();
    console.log(`Found ${emojiPaths.length} emojis.\n`);

    for (let i = 0; i < emojiPaths.length; i++) {
        let path = emojiPaths[i];
        const url = `https://emojipedia.org/${path}/`;
        const res = await fetch(url);
        if (!res.ok) {
            console.log(`not ok for ${path}, ${res.statusText}`);
            continue;
        }
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html")!;
        const textbox = doc.getElementById("emoji-copy")!;
        const emoji = textbox.attributes.value;
        path = path.replace(/-/g, "_");
        emojis[path] = emoji;
        ts += `\n  /** ${emoji} ${toTitleCase(
            path
        )} */\n  "${path}": "${emoji}",`;
        console.log(`[${i + 1}/${emojiPaths.length}] ${emoji} - ${path} done`);
    }

    Deno.writeTextFileSync("emojis.json", JSON.stringify(emojis));
    console.log("Written Emojis JSON file to " + "emojis.json");

    ts += `\n};`;
    Deno.writeTextFileSync("emojis.ts", ts);
    console.log("Written Emojis TS file to " + "emojis.ts");
};

await fetchEmojis();

// For the JSDoc comments.
function toTitleCase(str: string) {
    return str
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
