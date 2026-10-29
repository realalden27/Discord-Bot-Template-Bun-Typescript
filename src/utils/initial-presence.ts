import {
  ActivityType,
  PresenceUpdateStatus,
  type GatewayPresenceUpdateData,
} from "discord-api-types/v10";

const initialPresence = {
  since: null,
  activities: [
    {
      name: "Custom Status",
      state: "Ready to help",
      type: ActivityType.Custom,
    },
  ],
  status: PresenceUpdateStatus.Online,
  afk: false,
} satisfies GatewayPresenceUpdateData;

export default initialPresence;
