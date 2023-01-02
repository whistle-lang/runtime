import { WhistleProgram } from "../mod.ts";
import plugin from "../plugins/dom/mod.ts";

const binary = await Deno.readFile("./dom.wasm");
const module = await WebAssembly.compile(binary);
const program = new WhistleProgram(module);
program.add("DOM", plugin);
await program.run();
