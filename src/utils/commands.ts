import {
  ApplicationCommandType,
  type RESTPutAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";

export const commandNames = {
  about: "about",
} as const;

export const commandsPayload = [
  {
    name: commandNames.about,
    description: "Learn about this bot.",
    type: ApplicationCommandType.ChatInput,
  },
] satisfies RESTPutAPIApplicationCommandsJSONBody;
