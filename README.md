# grammY emoji

Adds emoji parsing for [grammY](https://github.com/grammyjs/grammY).
Check out the [official documentation](https://grammy.dev/plugins/emoji.html) to learn more about this plugin.

## Installation

Using npm:

```bash
npm install @grammyjs/emoji
```

Using Yarn:

```bash
yarn add @grammyjs/emoji
```

Using Deno:

```ts
import {/* ... */} from "https://deno.land/x/grammy_emoji/mod.ts";
```

## Usage

```ts
import { Bot, Context } from "grammy";
import { EmojiFlavor, emojiParser } from "@grammyjs/emoji";

type MyContext = EmojiFlavor<Context>;
const bot = new Bot<MyContext>(""); // <-- put your bot token between the ""

bot.use(emojiParser());

bot.command("ping", async (ctx) => {
    // Don't know emoji names? No problem!
    // Press Ctrl + Space on supported editors to
    // see IntelliSense auto-completion magic.
    await ctx.reply(ctx.emoji`Pong! ${"ping_pong"}`);
    // > Pong! 🏓
});

bot.command("start", async (ctx) => {
    await ctx
        .replyWithEmoji`Welcome to my bot! ${"grinning_face_with_big_eyes"}`;
    // > Welcome to my bot! 😀
});

bot.start();
```

## Contribute

Contributions are more than welcome! Just make sure if there is already a similar PR, so you can contribute from there.
