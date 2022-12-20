export type WhistlePlugin = (memoryAddress: string) => Record<string, WebAssembly.ImportValue>;

export interface ProgramOptions {
  wasi: {
    disable?: boolean;
    args?: string[];
    env?: { [index: string]: string };
    namespace?: string;
  }
}
