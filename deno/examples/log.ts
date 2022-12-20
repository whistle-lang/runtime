import * as log from "https://deno.land/std@0.170.0/log/mod.ts";
import { WhistleProgram } from "../mod.ts";
import { readString } from "../../utils.ts";
import { WhistleStorage } from "../mod.ts";

log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
    file: new log.handlers.FileHandler("WARNING", {
      filename: "./log.txt",
      formatter: "{levelName} {msg}",
    }),
  },

  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console", "file"],
    },

    tasks: {
      level: "ERROR",
      handlers: ["console"],
    },
  },
});

const logger = log.getLogger();

function plugin(address: string): Record<string, WebAssembly.ImportValue> {
  return {
    debug(content: number) {
      logger.debug(readString(content, WhistleStorage.memory.get(address)));
    },
    error(content: number) {
      logger.error(readString(content, WhistleStorage.memory.get(address)));
    },
    warning(content: number) {
      logger.warning(readString(content, WhistleStorage.memory.get(address)));
    },
    info(content: number) {
      logger.info(readString(content, WhistleStorage.memory.get(address)));
    },
  };
}

const binary = await Deno.readFile("./log.wasm");
const module = await WebAssembly.compile(binary);
const program = new WhistleProgram(module);
program.add("log", plugin);
await program.run();
