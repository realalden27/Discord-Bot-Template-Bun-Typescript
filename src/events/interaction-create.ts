import type { Client } from "@discordjs/core";
import {
  ComponentType,
  GatewayDispatchEvents,
  InteractionType,
  MessageFlags,
  SeparatorSpacingSize,
} from "discord-api-types/v10";
import { commandNames } from "../utils/commands";

const registerInteractionCreate = (client: Client, getBotName: () => string): void => {
  client.on(GatewayDispatchEvents.InteractionCreate, async ({ data, api }) => {
    if (data.type !== InteractionType.ApplicationCommand) {
      return;
    }

    if (data.data.name !== commandNames.about) {
      return;
    }

    try {
      await api.interactions.reply(data.id, data.token, {
        flags: MessageFlags.IsComponentsV2,
        components: [
          {
            type: ComponentType.Container,
            accent_color: 0x5865f2,
            components: [
              {
                type: ComponentType.TextDisplay,
                content: `# ${getBotName()}`,
              },
              {
                type: ComponentType.Separator,
                divider: true,
                spacing: SeparatorSpacingSize.Small,
              },
              {
                type: ComponentType.TextDisplay,
                content:
                  "A Discord bot built with Bun, TypeScript, and modular Discord.js packages.",
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error("Failed to respond to application command:", error);
    }
  });
};

export default registerInteractionCreate;
