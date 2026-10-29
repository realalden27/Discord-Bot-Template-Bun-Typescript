import type { Client } from "@discordjs/core";
import interactionCreate from "./interaction-create";

type EventHandler = (client: Client, getBotName: () => string) => void;

export const eventHandlers: EventHandler[] = [interactionCreate];
