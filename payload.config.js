import { buildConfig } from "payload/config";
import Events from "./collections/Events";
import Users from "./collections/Users";
import Media from "./collections/Media";

export default buildConfig({
  serverURL: "http://localhost:12000",
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Events,
    Media,
    // Add Collections here
    // Examples
  ],
});
