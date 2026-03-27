"use client";

import { useState, useCallback } from "react";
import { useEditor } from "@/hooks/use-editor";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
	Section,
	SectionContent,
	SectionField,
	SectionHeader,
	SectionTitle,
} from "../section";
import type { TextElement } from "@/types/timeline";
import {
	TEXT_ANIMATION_PRESETS,
	DEFAULT_TEXT_ANIMATION,
	type TextAnimationConfig,
} from "@/types/text-animation";
import { cn } from "@/utils/ui";

export function TextAnimationSection({
	element,
	trackId,
}: {
	element: TextElement;
	trackId: string;
}) {
	const editor = useEditor();
	const config = element.textAnimation ?? DEFAULT_TEXT_ANIMATION;
	const [local, setLocal] = useState<TextAnimationConfig>(config);

	const commit = useCallback(
		(newConfig: TextAnimationConfig) => {
			setLocal(newConfig);
			editor.timeline.setTextAnimation({
				elementId: element.id,
				trackId,
				textAnimation: newConfig.type === "none" ? undefined : newConfig,
			});
		},
		[editor, element.id, trackId],
	);

	return (
		<Section collapsible sectionKey="text:animation">
			<SectionHeader>
				<SectionTitle>Animation</SectionTitle>
			</SectionHeader>
			<SectionContent>
				<div className="flex flex-col gap-3">
					<div className="grid grid-cols-3 gap-1.5">
						<Button
							variant={local.type === "none" ? "default" : "outline"}
							size="sm"
							className={cn("text-xs h-7")}
							onClick={() => commit(DEFAULT_TEXT_ANIMATION)}
						>
							None
						</Button>
						{Object.entries(TEXT_ANIMATION_PRESETS).map(([key, preset]) => (
							<Button
								key={key}
								variant={local.type === preset.config.type ? "default" : "outline"}
								size="sm"
								className={cn("text-xs h-7")}
								onClick={() => commit(preset.config)}
							>
								{preset.name}
							</Button>
						))}
					</div>
					{local.type !== "none" && (
						<>
							<SectionField label={`Stagger: ${local.stagger.toFixed(2)}s`}>
								<Slider
									value={[local.stagger]}
									min={0.01}
									max={0.2}
									step={0.01}
									onValueChange={([v]) =>
										setLocal((prev) => ({ ...prev, stagger: v ?? prev.stagger }))
									}
									onValueCommit={([v]) =>
										commit({ ...local, stagger: v ?? local.stagger })
									}
								/>
							</SectionField>
							<SectionField label={`Duration: ${local.duration.toFixed(2)}s`}>
								<Slider
									value={[local.duration]}
									min={0.05}
									max={1.0}
									step={0.05}
									onValueChange={([v]) =>
										setLocal((prev) => ({ ...prev, duration: v ?? prev.duration }))
									}
									onValueCommit={([v]) =>
										commit({ ...local, duration: v ?? local.duration })
									}
								/>
							</SectionField>
						</>
					)}
				</div>
			</SectionContent>
		</Section>
	);
}
