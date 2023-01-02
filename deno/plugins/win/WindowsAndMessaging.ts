import {
  MessageBoxA,
  SetCursorPos,
} from "https://win32.deno.dev/0.2.0/UI.WindowsAndMessaging";

import { WhistleStorage } from "../../mod.ts";

export default function plugin(
  address: string,
): Record<string, WebAssembly.ImportValue> {
  return {
    MessageBoxA(ptr: bigint, _msg: number, _caption: number, MB: number) {
      const msg = WhistleStorage.string(address, _msg);
      const caption = WhistleStorage.string(address, _caption);
      MessageBoxA(
        ptr,
        msg,
        caption,
        MB,
      );
    },
    SetCursorPos(x: number, y: number) {
      SetCursorPos(x, y);
    },
  };
}
