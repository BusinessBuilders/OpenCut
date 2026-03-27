import { Command } from "@/lib/commands/base-command";
import { EditorCore } from "@/core";
import { updateElementInTracks } from "@/lib/timeline";
import type { TimelineTrack } from "@/types/timeline";
import type { TextAnimationConfig } from "@/types/text-animation";

export class SetTextAnimationCommand extends Command {
	private savedState: TimelineTrack[] | null = null;

	constructor(
		private readonly elementId: string,
		private readonly trackId: string,
		private readonly textAnimation: TextAnimationConfig | undefined,
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
			update: (element) => ({ ...element, textAnimation: this.textAnimation }),
		});
		editor.timeline.updateTracks(updatedTracks);
	}

	undo(): void {
		if (this.savedState) {
			EditorCore.getInstance().timeline.updateTracks(this.savedState);
		}
	}
}
