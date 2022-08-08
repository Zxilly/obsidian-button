import {MarkdownPostProcessorContext, normalizePath, Notice, Plugin, TFile} from "obsidian";
import {isURL} from "./utils";

export default class ButtonPlugin extends Plugin {

    async onload(): Promise<void> {
        this.registerMarkdownPostProcessor((el, ctx) => {
            console.log("markdown post processor");
            const buttons = el.querySelectorAll("button");
            for (let i = 0; i < buttons.length; i++) {
                const button = buttons[i];
                const entries = Object.entries(button.dataset);
                if (entries.length > 0) {
                    this.evalButton(button, ctx);
                }
            }
        });
    }

    evalButton(button: HTMLButtonElement, ctx: MarkdownPostProcessorContext): void {
        const method = button.dataset.method ?? "GET";
        const url = button.dataset.url;
        const refresh = button.dataset.refresh ?? "";

        if (url === undefined) {
            return;
        }

        if (!isURL(url)) {
            console.log(Error(`Invalid URL: ${url}`));
            return;
        }
        const clickHandler = async (e: MouseEvent) => {
            try {
                e.preventDefault();
                const resp = await fetch(url, {
                    method,
                });
                if (resp.ok) {
                    new Notice(`${button.innerText} successfully executed.`);
                    // if (refresh) {
                    //     const refreshEl = document.getElementById(refresh);
                    //     if (refreshEl && refreshEl instanceof HTMLImageElement) {
                    //     }
                    // }
                    const tFile = this.app.vault.getAbstractFileByPath(ctx.sourcePath);
                    if (tFile instanceof TFile){
                        const content = await this.app.vault.cachedRead(tFile);
                    }
                }
            } catch (e) {
                console.error(e);
                new Notice(`${button.innerText} failed to execute.`);
            }
        }

        button.addEventListener("click", clickHandler);
    }
}
