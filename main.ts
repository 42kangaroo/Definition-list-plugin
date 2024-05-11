import {Plugin} from 'obsidian';
import {defListField} from "./viewPlug";

import {DefList} from "./defList";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerEditorExtension([defListField.extension]);

		this.registerMarkdownPostProcessor((elements, context) => {
			var doc = elements.innerHTML;
			doc = doc + "\n";
			let regexp = new RegExp(/.*[\r\n|\r|\n]:\s(.+[\r\n|\r|\n])*/g);
			var match;
			while ((match = regexp.exec(doc)) != null) {
				var deL = new DefList(match[0], this);
				var teC = deL.toDomNoView().innerHTML;
				if (teC != null) {
					doc = doc.replace(match[0], teC);
				}
			}
			elements.innerHTML = doc;
		});
	}

	onunload() {

	}




	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
