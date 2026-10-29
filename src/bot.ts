import { Client } from "@discordjs/core";
import { DiscordAPIError, REST } from "@discordjs/rest";
import { WebSocketManager } from "@discordjs/ws";
import { GatewayDispatchEvents, GatewayIntentBits } from "discord-api-types/v10";
import { eventHandlers } from "./events/events";
import { commandsPayload } from "./utils/commands";
import initialPresence from "./utils/initial-presence";

let BOT_NAME = "Discord Bot";

process.title = BOT_NAME;

const token = process.env["BOT_TOKEN"];

if (!token) {
  throw new Error("Missing BOT_TOKEN environment variable.");
}

const tokenPrefix = token.split(".")[0];

if (!tokenPrefix) {
  throw new Error("BOT_TOKEN does not contain a Discord client ID.");
}

let applicationId: string;

try {
  applicationId = atob(tokenPrefix);
} catch (error) {
  throw new Error("BOT_TOKEN does not contain a valid Discord client ID.", { cause: error });
}

if (!/^\d+$/.test(applicationId)) {
  throw new Error("BOT_TOKEN does not contain a valid Discord client ID.");
}

process.on("uncaughtException", (error) => {
  console.error("Unhandled exception; shutting down:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled promise rejection; shutting down:", { promise, reason });
  process.exit(1);
});

const rest = new REST({ version: "10" }).setToken(token);
const gateway = new WebSocketManager({
  token,
  intents: GatewayIntentBits.Guilds,
  rest,
  shardCount: null,
  initialPresence,
});
const client = new Client({ rest, gateway });

for (const registerEvent of eventHandlers) {
  registerEvent(client, () => BOT_NAME);
}

client.on(GatewayDispatchEvents.Ready, async ({ data }) => {
  applicationId = data.user.id;
  BOT_NAME = data.user.global_name ?? data.user.username;
  process.title = BOT_NAME;
  console.info(`Logged in as ${data.user.username} (${applicationId})`);

  try {
    const commands = await client.api.applicationCommands.bulkOverwriteGlobalCommands(
      applicationId,
      commandsPayload,
    );
    console.info(`Registered ${commands.length} global application command(s).`);
  } catch (error) {
    console.error("Failed to register global application commands:", error);
    process.exit(1);
  }
});

try {
  await gateway.connect();
} catch (error) {
  if (error instanceof DiscordAPIError && error.status === 401) {
    console.error("Discord rejected BOT_TOKEN. Check that .env contains the correct bot token.");
  } else {
    console.error(`Failed to start ${BOT_NAME}:`, error);
  }

  process.exit(1);
}
