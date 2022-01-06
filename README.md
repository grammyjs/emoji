# grammY Emoji

Adds emoji parsing for [grammY](https://github.com/grammyjs/grammY). Check out the [official documentation](https://grammy.dev/plugins/emoji.html) for this plugin.
**While this draft is working, we still do not recommend using it in production.**

## Installation

Using NPM:

```bash
npm install @grammyjs/emoji // TBD
```

Using Yarn:

```bash
yarn add @grammyjs/emoji // TBD
```

Using Deno:

```ts
import {...} from "https://github.com/grammyjs/emoji/src/mod.ts";
```

## Example Usage

```ts
import { Bot, Context } from "grammy";
import { EmojiFlavor, emojiParser } from "@grammyjs/emoji";

type FlavoredContext = Context & EmojiFlavor;
const bot = new Bot<FlavoredContext>(""); // <-- put your bot token between the ""

bot.use(emojiParser());

bot.command("ping", async (ctx) => {
    // Don't know emoji names? No problem!
    // Press Ctrl + Space on supported editors to
    // see IntelliSense auto-completion magic.
    await ctx.reply(ctx.emoji`Pong! ${"ping_pong"}`); // Pong! 🏓
});

bot.command("start", async (ctx) => {
    await ctx.replyWithEmoji`Welcome to my bot! ${"grinning_face"}`; // Welcome to my bot! 😀
});

bot.start();
```

## Pull Requests

Contributions are more than welcome! Just make sure if there is already a similar PR, so you can contribute from there.
