import { readString } from "../utils.ts";

export class WhistleStorage {
  static memory = new Map<string, WebAssembly.Memory>();

  static string(address: string, ptr: number): string {
    const mem = this.memory.get(address)!;
    return readString(ptr, mem)
  }
}
