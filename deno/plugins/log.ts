import * as log from "https://deno.land/std@0.170.0/log/mod.ts";
import { readString } from "../utils.ts";
import { WhistleStorage } from "../mod.ts";

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

export default function plugin(address: string): Record<string, WebAssembly.ImportValue> {
  return {
    debug(content: number) {
      log.debug(readString(content, WhistleStorage.memory.get(address)));
    },
    error(content: number) {
      log.error(readString(content, WhistleStorage.memory.get(address)));
    },
    warning(content: number) {
      log.warning(readString(content, WhistleStorage.memory.get(address)));
    },
    info(content: number) {
      log.info(readString(content, WhistleStorage.memory.get(address)));
    },
  };
}