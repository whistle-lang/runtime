import { WhistleProgram } from "../mod.ts";
import plugin from "../plugins/log/mod.ts";

const binary = await Deno.readFile("./log.wasm");
const module = await WebAssembly.compile(binary);
const program = new WhistleProgram(module);
program.add("log", plugin);
await program.run();
