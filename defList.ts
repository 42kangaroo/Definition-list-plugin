import { EditorView, WidgetType } from "@codemirror/view";
import {Component, MarkdownRenderer, normalizePath} from "obsidian";


export class DefList extends WidgetType {
	text: string
	par: Component

	constructor(text: string, par: Component) {
		super();
		this.text = text;
		this.par = par;
	}

	toDomNoView(): HTMLElement {
		const dl = document.createElement("div");
		if (this.text.substring(0, 9) != "> [!def] ") {
			this.text = "> [!def] " + this.text;
			this.text = this.text.replace("\n", "\n> ");
			this.text = this.text.replace("<br>", "\n> ");
			this.text = this.text.replace("> : ", "> ");
			if (this.text.substring(this.text.length - 2, this.text.length) == "> ") {
				this.text = this.text.substring(0, this.text.length - 2);
			}
		}
		const actF = app.workspace.getActiveFile();
		var path = "";
		if (actF != null) {
			path = normalizePath(actF.path);
		}
		MarkdownRenderer.render(app, this.text, dl.appendChild(document.createElement("div")), path, this.par);
		return dl;
	}

	toDOM(view: EditorView): HTMLElement {
		return this.toDomNoView();
	}

	ignoreEvent(event: Event): boolean {
		return event.type != "selectionchange";
	}

}
