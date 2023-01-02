import * as log from "https://deno.land/std@0.170.0/log/mod.ts";
import { WhistleStorage } from "../../mod.ts";

log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
  },

  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },

    tasks: {
      level: "ERROR",
      handlers: ["console"],
    },
  },
});

export default function plugin(
  address: string,
): Record<string, WebAssembly.ImportValue> {
  return {
    debug(content: number) {
      log.debug(WhistleStorage.string(address, content));
    },
    error(content: number) {
      log.error(WhistleStorage.string(address, content));
    },
    warning(content: number) {
      log.warning(WhistleStorage.string(address, content));
    },
    info(content: number) {
      log.info(WhistleStorage.string(address, content));
    },
  };
}
