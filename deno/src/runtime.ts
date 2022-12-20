import { WhistleStorage } from "./storage.ts";
import { ProgramOptions, WhistlePlugin } from "./types.ts";
import Context from "https://deno.land/std@0.167.0/wasi/snapshot_preview1.ts";

export class WhistleProgram {
  #id = crypto.randomUUID();
  #module: WebAssembly.Module;
  #imports: WebAssembly.Imports = {};
  #wasi?: Context;
  #options: Partial<ProgramOptions>;
  constructor(
    module: WebAssembly.Module,
    options: Partial<ProgramOptions> = {},
  ) {
    this.#module = module;
    this.#options = options;
    if (!this.#options.wasi?.disable) {
      this.#wasi = new Context({
        args: this.#options.wasi?.args || Deno.args,
        env: this.#options.wasi?.env || Deno.env.toObject(),
      });
      this.#imports[this.#options.wasi?.namespace || "wasi_unstable"] =
        this.#wasi.exports;
    }
    WhistleStorage.memory.set(this.#id, new WebAssembly.Memory({ initial: 0 }));
  }
  add(name: string, plugin: WhistlePlugin) {
    const imp = plugin(this.#id);
    this.#imports[name] = imp;
  }

  async run() {
    const instance = await WebAssembly.instantiate(this.#module, {
      ...this.#imports,
    });
    // deno-lint-ignore no-explicit-any
    WhistleStorage.memory.set(this.#id, (instance.exports as any).memory);
    if (!this.#options.wasi?.disable) {
      this.#wasi!.start(instance);
    }
    return instance;
  }
}
