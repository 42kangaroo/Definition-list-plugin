/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => MyPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// viewPlug.ts
var import_state = require("@codemirror/state");
var import_view2 = require("@codemirror/view");

// defList.ts
var import_view = require("@codemirror/view");
var import_obsidian = require("obsidian");
var DefList = class extends import_view.WidgetType {
  constructor(text, par) {
    super();
    this.text = text;
    this.par = par;
  }
  toDomNoView() {
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
      path = (0, import_obsidian.normalizePath)(actF.path);
    }
    import_obsidian.MarkdownRenderer.render(app, this.text, dl.appendChild(document.createElement("div")), path, this.par);
    return dl;
  }
  toDOM(view) {
    return this.toDomNoView();
  }
  ignoreEvent(event) {
    return event.type != "selectionchange";
  }
};

// viewPlug.ts
var defListField = import_state.StateField.define({
  create(state) {
    return import_view2.Decoration.none;
  },
  update(dlSet, transaction) {
    dlSet = dlSet.map(transaction.changes);
    var mi = transaction.state.selection.main.from, ma = transaction.state.selection.main.to;
    transaction.changes.desc.iterChangedRanges((fromA, toA, fromB, toB) => {
      mi = Math.min(mi, fromB);
      ma = Math.max(ma, toB);
    });
    mi = transaction.newDoc.line(Math.max(transaction.newDoc.lineAt(mi).number - 100, 1)).from;
    ma = transaction.newDoc.line(Math.min(transaction.newDoc.lineAt(ma).number + 100, transaction.newDoc.lines)).to;
    let doc = transaction.newDoc.sliceString(mi, ma);
    dlSet = dlSet.update({ filter: (from, to) => {
      return !(from >= mi && to <= ma);
    } });
    let regexp = new RegExp(/.*[\r\n|\r|\n]:\s(.+[\r\n|\r|\n])*/g);
    var match;
    while ((match = regexp.exec(doc)) != null) {
      if (!(transaction.newDoc.lineAt(mi + match.index + match[0].length).to < transaction.state.selection.main.from || mi + match.index > transaction.state.selection.main.to))
        continue;
      if (match.index + match[0].length < doc.length) {
        var dL = new DefList(match[0], this);
        dlSet = dlSet.update({ add: [import_view2.Decoration.replace({ widget: dL }).range(mi + match.index, mi + match.index + match[0].length)] });
      }
    }
    return dlSet;
  },
  provide(field) {
    return import_view2.EditorView.decorations.from(field);
  }
});

// main.ts
var DEFAULT_SETTINGS = {
  mySetting: "default"
};
var MyPlugin = class extends import_obsidian2.Plugin {
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
};
