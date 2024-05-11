import {
	Extension,
	StateField,
	Transaction,
} from "@codemirror/state";
import {
	Decoration,
	DecorationSet,
	EditorView,
} from "@codemirror/view";
import {DefList} from "./defList";

export const defListField = StateField.define<DecorationSet>({
	create(state): DecorationSet {
		return Decoration.none;
	},
	update(dlSet: DecorationSet, transaction: Transaction): DecorationSet {
		dlSet = dlSet.map(transaction.changes);
		var mi = transaction.state.selection.main.from, ma = transaction.state.selection.main.to;
		transaction.changes.desc.iterChangedRanges((fromA, toA, fromB, toB) => {mi = Math.min(mi, fromB); ma = Math.max(ma, toB);});
		mi = transaction.newDoc.line(Math.max(transaction.newDoc.lineAt(mi).number - 100, 1)).from;
		ma = transaction.newDoc.line(Math.min(transaction.newDoc.lineAt(ma).number + 100, transaction.newDoc.lines)).to;
		let doc = transaction.newDoc.sliceString(mi, ma);
		dlSet = dlSet.update({filter: (from, to) => {return !(from >= mi && to <= ma)}});
		let regexp = new RegExp(/.*[\r\n|\r|\n]:\s(.+[\r\n|\r|\n])*/g);
		var match;
		while ((match = regexp.exec(doc)) != null) {
			if (!(transaction.newDoc.lineAt(match.index  + match[0].length).to < transaction.state.selection.main.from || match.index > transaction.state.selection.main.to)) continue;
			if (match.index + match[0].length < doc.length) {
				var dL = new DefList(match[0], this);
				dlSet = dlSet.update({add: [Decoration.replace({widget: dL}).range(match.index, match.index + match[0].length)]});
			}
		}
		return dlSet;
	},
	provide(field: StateField<DecorationSet>): Extension {
		return EditorView.decorations.from(field);
	},
});


