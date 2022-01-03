# Emoji Parser

Adds emoji parsing for [grammY](https://github.com/grammyjs/grammY). Check out the [official documentation]() for this plugin.

# Installation

Using NPM:

```bash
npm install @grammyjs/emoji
```

Using Yarn:

```bash
yarn add @grammyjs/emoji
```

Using Deno:

```ts
import {} from "https://deno.land/x/grammy/emoji/mod.ts"; // TBD
```

# Example usage

```ts
import { Bot, Context } from "grammy";
import { EmojiFlavor, emojiParser } from "@grammyjs/emoji";

type FlavoredContext = EmojiFlavor<Context>;
const bot = new Bot<FlavoredContext>(process.env.TOKEN);

bot.command("ping", async (ctx) => {
    await ctx.reply(ctx.emoji`Pong! ${"table_tennis"}`); // Pong! 🏓
});

bot.command("start", async (ctx) => {
    await ctx.replyWithEmoji`Welcome to my bot! ${"smiley"}`; // Welcome to my bot! 😃
});

bot.start();
```

# Pull requests

Contributions are more than welcome! Just make sure if there is already a similar PR, so you can contribute from there.

# TODO

- [ ] Add emoji completion for TypeScript
- [ ] Add support for new Unicode 14 emojis
- [ ] Rename emojis to be more concise and small
- [ ] Add support for skin-toned emojis
- [x] Remove unused code
