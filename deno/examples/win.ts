import { WhistleProgram } from "../mod.ts";
import plugin from "../plugins/win/WindowsAndMessaging.ts";

const binary = await Deno.readFile("./win.wasm");
const module = await WebAssembly.compile(binary);
const program = new WhistleProgram(module);
program.add("WindowsAndMessaging", plugin);
await program.run();
