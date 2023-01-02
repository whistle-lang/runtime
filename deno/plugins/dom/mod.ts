import {
  DOMParser,
  Element,
  HTMLDocument,
} from "https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts";

import { WhistleStorage } from "../../mod.ts";

class DocumentManager {
  static stored = new Map<number, HTMLDocument>();
  static currentId = -1;
  static byId(id: number) {
    return this.stored.get(id)!;
  }
  static from(content: string) {
    this.currentId++;
    this.stored.set(this.currentId, new DOMParser().parseFromString(content, "text/html")!);
    return this.currentId;
  }
}

class SelectionManager {
    static stored = new Map<number, Element>();
    static currentId = -1;
    static byId(id: number) {
        return this.stored.get(id);
    }
    static querySelector(doc: number, content: string) {
        this.currentId++;
        this.stored.set(this.currentId, DocumentManager.byId(doc).querySelector(content)!);
        return this.currentId;
    }

    static setInnerHTML(element: number, content: string) {
        const el = this.stored.get(element)!;
        el.innerHTML = content;
    }
}

export default function plugin(
  address: string,
): Record<string, WebAssembly.ImportValue> {
  return {
    Document(content: number) {
      return DocumentManager.from(WhistleStorage.string(address, content))
    },

    PrintDocument(doc: number) {
      console.log(DocumentManager.byId(doc));
    },

    DocumentQuerySelector(doc: number, _selectors: number) {
      const selectors = WhistleStorage.string(address, _selectors);
      return SelectionManager.querySelector(doc, selectors);
    },

    ElementSetInnerHTML(element: number, content: number) {
      SelectionManager.setInnerHTML(element, WhistleStorage.string(address, content));
    }
  };
}
