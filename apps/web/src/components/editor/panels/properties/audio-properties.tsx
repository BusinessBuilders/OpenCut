"use client";

import { useEditor } from "@/hooks/use-editor";
import { NumberField } from "@/components/ui/number-field";
import { Slider } from "@/components/ui/slider";
import {
	Section,
	SectionContent,
	SectionField,
	SectionHeader,
	SectionTitle,
} from "./section";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { AudioElement } from "@/types/timeline";
import type { AudioFade } from "@/types/audio-fade";
import { DEFAULT_AUDIO_FADE } from "@/types/audio-fade";
import { useState, useCallback } from "react";
import { useElementSelection } from "@/hooks/timeline/element/use-element-selection";

export function AudioProperties() {
	const editor = useEditor();
	const { selectedElements } = useElementSelection();

	const elementsWithTracks = editor.timeline.getElementsWithTracks({
		elements: selectedElements,
	});
	const first = elementsWithTracks[0];
	if (!first || first.element.type !== "audio") return null;

	const element = first.element as AudioElement;
	const trackId = first.track.id;

	return (
		<div className="flex h-full flex-col">
			<AudioFadeSection element={element} trackId={trackId} />
		</div>
	);
}

function AudioFadeSection({
	element,
	trackId,
}: {
	element: AudioElement;
	trackId: string;
}) {
	const editor = useEditor();
	const fade = element.fade ?? DEFAULT_AUDIO_FADE;

	const [local, setLocal] = useState<AudioFade>(fade);

	const commit = useCallback(
		(updates: Partial<AudioFade>) => {
			const next = { ...local, ...updates };
			setLocal(next);
			editor.timeline.setAudioFade({
				elementId: element.id,
				trackId,
				fade: next.fadeIn === 0 && next.fadeOut === 0 ? undefined : next,
			});
		},
		[editor, element.id, trackId, local],
	);

	const preview = useCallback(
		(updates: Partial<AudioFade>) => {
			setLocal((prev) => ({ ...prev, ...updates }));
		},
		[],
	);

	return (
		<Section collapsible sectionKey="audio:fade" showTopBorder={false}>
			<SectionHeader>
				<SectionTitle>Fade</SectionTitle>
			</SectionHeader>
			<SectionContent>
				<div className="flex flex-col gap-3">
					<SectionField label="Fade In">
						<div className="flex items-center gap-2">
							<Slider
								className="flex-1"
								value={[local.fadeIn]}
								min={0}
								max={Math.min(element.duration / 2, 5)}
								step={0.1}
								onValueChange={([v]) => preview({ fadeIn: v })}
								onValueCommit={([v]) => commit({ fadeIn: v })}
							/>
							<NumberField
								className="w-14"
								value={local.fadeIn.toFixed(1)}
								min={0}
								max={element.duration / 2}
								onBlur={(e) => {
									const parsed = Number.parseFloat(e.currentTarget.value);
									if (!Number.isNaN(parsed)) commit({ fadeIn: parsed });
								}}
							/>
						</div>
					</SectionField>
					<SectionField label="Fade Out">
						<div className="flex items-center gap-2">
							<Slider
								className="flex-1"
								value={[local.fadeOut]}
								min={0}
								max={Math.min(element.duration / 2, 5)}
								step={0.1}
								onValueChange={([v]) => preview({ fadeOut: v })}
								onValueCommit={([v]) => commit({ fadeOut: v })}
							/>
							<NumberField
								className="w-14"
								value={local.fadeOut.toFixed(1)}
								min={0}
								max={element.duration / 2}
								onBlur={(e) => {
									const parsed = Number.parseFloat(e.currentTarget.value);
									if (!Number.isNaN(parsed)) commit({ fadeOut: parsed });
								}}
							/>
						</div>
					</SectionField>
					<SectionField label="Curve">
						<Select
							value={local.curve}
							onValueChange={(v) =>
								commit({ curve: v as AudioFade["curve"] })
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="linear">Linear</SelectItem>
								<SelectItem value="exponential">Exponential</SelectItem>
								<SelectItem value="scurve">S-Curve</SelectItem>
							</SelectContent>
						</Select>
					</SectionField>
				</div>
			</SectionContent>
		</Section>
	);
}
