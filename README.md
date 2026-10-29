# Discord Bot Template

A reusable Discord bot starter built with Bun, TypeScript, and modular
Discord.js packages. It includes a global `/about` command as an example.

## Getting started

### Requirements

- [Bun](https://bun.sh/) installed.
- A Discord application and bot created in the
  [Discord Developer Portal](https://discord.com/developers/applications).

### Configure and run

1. In the Discord Developer Portal, create an application and add a bot user.
2. Copy `.env.example` to `.env` and set `BOT_TOKEN` to the bot token. Keep the
   token private; never commit `.env` or paste the token into logs or code.
3. Invite the bot to a test server with the permissions its features require.
   The current starter only needs the Guilds gateway intent.
4. Install dependencies and start the bot:

   ```sh
   bun install
   bun run dev
   ```

The bot fetches its account-level display name when it connects, falling back
to its username. It uses that name for the process title and `/about` response.
It starts online with a custom `Ready to help` status. Global slash commands
are registered on startup; Discord may take a little time to show command
changes everywhere.

## Project structure

```text
src/
  bot.ts                       # Configure the client, load events, connect
  events/
    events.ts                  # Event handler registry
    interaction-create.ts      # Slash-command interaction handling
  utils/
    commands.ts                # Command names and global command payload
    initial-presence.ts        # Initial online status and activity
```

Keep command definitions together in `src/utils/commands.ts`. Put gateway event
logic in focused modules under `src/events/`, then add each event module to
`src/events/events.ts`. Keep `src/bot.ts` focused on startup, shared client
configuration, and registering the event and command lists.

Customize the initial status and activity in `src/utils/initial-presence.ts`.

## Adding a slash command

1. Add its stable name to `commandNames` and its typed definition to
   `commandsPayload` in `src/utils/commands.ts`.
2. Handle it in `src/events/interaction-create.ts`: return early for
   non-application-command interactions, match `data.data.name` against the
   shared `commandNames` entry, then respond through
   `api.interactions.reply`.
3. Keep the handler fast enough to acknowledge the interaction before
   Discord's deadline. For longer work, defer the interaction first and edit
   or follow up on the deferred response.
4. Add any required gateway intents in `src/bot.ts` and enable privileged
   intents in the Developer Portal when Discord requires them. Request only
   the intents the feature needs.
5. Add or update tests where practical, then run the checks below.

The bot bulk-overwrites its global application commands from
`commandsPayload` after it becomes ready. This replaces the existing global
command list, so include every global command owned by this bot in that
payload; do not register an incomplete list.

## Adding a gateway event

1. Create a focused module under `src/events/` and subscribe to the appropriate
   `GatewayDispatchEvents` event using the shared `Client` type.
2. Handle expected invalid or irrelevant events with guard clauses. Handle
   asynchronous work and report failures at the event boundary without
   exposing tokens or other secrets.
3. Add the event module to the `eventHandlers` list in
   `src/events/events.ts`.
4. Enable only the gateway intent needed for that event, and configure
   privileged intents in the Developer Portal if necessary.

## Discord responses

Use typed payloads from `discord-api-types/v10`. Rich responses should use
Components V2: set `MessageFlags.IsComponentsV2` and provide `components`.
Do not mix Components V2 with legacy message `content` or `embeds` in the same
response. Check Discord's component and message limits when building larger
responses.

## Development checks

```sh
bun run format
bun run check
bun run build
```

`bun run check` runs TypeScript typechecking, ESLint, and Prettier's formatting
check. Run the bot with `bun run dev` while developing or `bun run start` for a
normal run. `bun run build` creates `dist/bot.js`, which can be run with
`bun run dist/bot.js`.

There is no test suite yet. If you add tests, use `bun test` and keep them
deterministic and independent of live Discord services. After changing
dependencies, run `bun install` and include the updated manifest and lockfile.
