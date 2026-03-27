"use client";

import { useEditor } from "@/hooks/use-editor";
import { NumberField } from "@/components/ui/number-field";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
	Section,
	SectionContent,
	SectionField,
	SectionHeader,
	SectionTitle,
} from "../section";
import type { VideoElement, ImageElement } from "@/types/timeline";
import type { ColorAdjustments } from "@/types/color";
import { DEFAULT_COLOR_ADJUSTMENTS } from "@/types/color";
import { useState, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowTurnBackwardIcon } from "@hugeicons/core-free-icons";

type ColorGradingElement = VideoElement | ImageElement;

interface ColorSliderProps {
	label: string;
	value: number;
	min: number;
	max: number;
	step?: number;
	onChange: (value: number) => void;
	onCommit: (value: number) => void;
}

function ColorSlider({
	label,
	value,
	min,
	max,
	step = 1,
	onChange,
	onCommit,
}: ColorSliderProps) {
	return (
		<SectionField label={label}>
			<div className="flex items-center gap-2">
				<Slider
					className="flex-1"
					value={[value]}
					min={min}
					max={max}
					step={step}
					onValueChange={([v]) => onChange(v)}
					onValueCommit={([v]) => onCommit(v)}
				/>
				<NumberField
					className="w-14"
					value={value.toString()}
					min={min}
					max={max}
					onBlur={(e) => {
						const parsed = Number.parseFloat(e.currentTarget.value);
						if (!Number.isNaN(parsed)) onCommit(parsed);
					}}
				/>
			</div>
		</SectionField>
	);
}

export function ColorGradingSection({
	element,
	trackId,
}: {
	element: ColorGradingElement;
	trackId: string;
}) {
	const editor = useEditor();
	const adjustments = element.colorAdjustments ?? DEFAULT_COLOR_ADJUSTMENTS;

	const [local, setLocal] = useState<ColorAdjustments>(adjustments);

	const commit = useCallback(
		(updates: Partial<ColorAdjustments>) => {
			const next = { ...local, ...updates };
			setLocal(next);
			editor.timeline.setColorAdjustments({
				elementId: element.id,
				trackId,
				colorAdjustments: next,
			});
		},
		[editor, element.id, trackId, local],
	);

	const preview = useCallback(
		(updates: Partial<ColorAdjustments>) => {
			setLocal((prev) => ({ ...prev, ...updates }));
		},
		[],
	);

	const resetAll = useCallback(() => {
		setLocal(DEFAULT_COLOR_ADJUSTMENTS);
		editor.timeline.setColorAdjustments({
			elementId: element.id,
			trackId,
			colorAdjustments: undefined,
		});
	}, [editor, element.id, trackId]);

	const hasAdjustments = Object.values(local).some((v) => v !== 0);

	return (
		<Section collapsible sectionKey={`${element.type}:color-grading`}>
			<SectionHeader
				trailing={
					hasAdjustments ? (
						<Button
							variant="ghost"
							size="icon"
							onClick={(e) => {
								e.stopPropagation();
								resetAll();
							}}
							title="Reset color adjustments"
						>
							<HugeiconsIcon icon={ArrowTurnBackwardIcon} className="size-3.5" />
						</Button>
					) : null
				}
			>
				<SectionTitle>Color</SectionTitle>
			</SectionHeader>
			<SectionContent>
				<div className="flex flex-col gap-3">
					<ColorSlider
						label="Exposure"
						value={local.exposure}
						min={-200}
						max={200}
						onChange={(v) => preview({ exposure: v })}
						onCommit={(v) => commit({ exposure: v })}
					/>
					<ColorSlider
						label="Brightness"
						value={local.brightness}
						min={-100}
						max={100}
						onChange={(v) => preview({ brightness: v })}
						onCommit={(v) => commit({ brightness: v })}
					/>
					<ColorSlider
						label="Contrast"
						value={local.contrast}
						min={-100}
						max={100}
						onChange={(v) => preview({ contrast: v })}
						onCommit={(v) => commit({ contrast: v })}
					/>
					<ColorSlider
						label="Saturation"
						value={local.saturation}
						min={-100}
						max={100}
						onChange={(v) => preview({ saturation: v })}
						onCommit={(v) => commit({ saturation: v })}
					/>
					<ColorSlider
						label="Temperature"
						value={local.temperature}
						min={-100}
						max={100}
						onChange={(v) => preview({ temperature: v })}
						onCommit={(v) => commit({ temperature: v })}
					/>
				</div>
			</SectionContent>
		</Section>
	);
}
