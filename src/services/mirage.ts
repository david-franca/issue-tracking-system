import { createServer, Model } from "miragejs";

import db from "./db.json";

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    environment,

    models: {
      issue: Model,
    },

    seeds(server) {
      server.db.loadData({
        issues: db,
      });
    },

    routes() {
      this.namespace = "api";

      this.get("/issues", () => {
        return this.schema.all("issue");
      });
    },
  });

  return server;
}
