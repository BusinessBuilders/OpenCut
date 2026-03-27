import { Command } from "@/lib/commands/base-command";
import { EditorCore } from "@/core";
import { updateElementInTracks, isVisualElement } from "@/lib/timeline";
import type { TimelineTrack } from "@/types/timeline";
import type { ColorAdjustments } from "@/types/color";

export class SetColorAdjustmentsCommand extends Command {
	private savedState: TimelineTrack[] | null = null;

	constructor(
		private readonly elementId: string,
		private readonly trackId: string,
		private readonly colorAdjustments: ColorAdjustments | undefined,
	) {
		super();
	}

	execute(): void {
		const editor = EditorCore.getInstance();
		this.savedState = editor.timeline.getTracks();
		const updatedTracks = updateElementInTracks({
			tracks: this.savedState,
			trackId: this.trackId,
			elementId: this.elementId,
			elementPredicate: isVisualElement,
			update: (element) => ({ ...element, colorAdjustments: this.colorAdjustments }),
		});
		editor.timeline.updateTracks(updatedTracks);
	}

	undo(): void {
		if (this.savedState) {
			EditorCore.getInstance().timeline.updateTracks(this.savedState);
		}
	}
}
