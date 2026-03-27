import { useState } from "react";
import { useEditor } from "@/hooks/use-editor";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Section, SectionContent, SectionField, SectionHeader, SectionTitle } from "../section";
import type { SpeedCurve } from "@/types/speed";
import { SPEED_PRESETS } from "@/types/speed";

type SpeedElement = {
	id: string;
	type: "video" | "image";
	speedCurve?: SpeedCurve;
	reversed?: boolean;
	startTime: number;
	duration: number;
};

const SPEED_PRESET_LABELS: Record<string, string> = {
	montage: "Montage",
	"bullet-time": "Bullet Time",
	"ramp-up": "Ramp Up",
	"ramp-down": "Ramp Down",
};

function getConstantSpeed(speedCurve: SpeedCurve | undefined): number {
	if (!speedCurve || speedCurve.points.length === 0) return 1;
	// If all points have the same speed, it's a constant curve
	const first = speedCurve.points[0]?.speed ?? 1;
	const isConstant = speedCurve.points.every((p) => p.speed === first);
	return isConstant ? first : 1;
}

export function SpeedSection({
	element,
	trackId,
}: {
	element: SpeedElement;
	trackId: string;
}) {
	const editor = useEditor();
	const currentSpeed = getConstantSpeed(element.speedCurve);
	const [localSpeed, setLocalSpeed] = useState(currentSpeed);

	const handleSpeedChange = (values: number[]) => {
		const value = values[0] ?? 1;
		setLocalSpeed(value);
	};

	const handleSpeedCommit = (values: number[]) => {
		const value = values[0] ?? 1;
		setLocalSpeed(value);
		const speedCurve: SpeedCurve = {
			points: [
				{ time: 0, speed: value },
				{ time: 1, speed: value },
			],
			interpolation: "linear",
		};
		editor.timeline.setSpeedCurve({
			elementId: element.id,
			trackId,
			speedCurve,
			reversed: element.reversed,
		});
	};

	const handleReverseToggle = (checked: boolean) => {
		editor.timeline.setSpeedCurve({
			elementId: element.id,
			trackId,
			speedCurve: element.speedCurve,
			reversed: checked,
		});
	};

	const handlePreset = (presetKey: string) => {
		const preset = SPEED_PRESETS[presetKey];
		if (!preset) return;
		editor.timeline.setSpeedCurve({
			elementId: element.id,
			trackId,
			speedCurve: preset,
			reversed: element.reversed,
		});
	};

	return (
		<Section collapsible sectionKey={`${element.type}:speed`}>
			<SectionHeader><SectionTitle>Speed</SectionTitle></SectionHeader>
			<SectionContent>
				<div className="flex flex-col gap-3.5">
					<SectionField label={`Speed: ${localSpeed.toFixed(1)}x`}>
						<Slider
							min={0.1}
							max={5}
							step={0.1}
							value={[localSpeed]}
							onValueChange={handleSpeedChange}
							onValueCommit={handleSpeedCommit}
						/>
					</SectionField>
					<SectionField label="Reverse">
						<Switch
							checked={element.reversed ?? false}
							onCheckedChange={handleReverseToggle}
						/>
					</SectionField>
					<SectionField label="Presets">
						<div className="flex flex-wrap gap-1.5">
							{Object.keys(SPEED_PRESETS).map((key) => (
								<Button
									key={key}
									variant="outline"
									size="sm"
									onClick={() => handlePreset(key)}
								>
									{SPEED_PRESET_LABELS[key] ?? key}
								</Button>
							))}
						</div>
					</SectionField>
				</div>
			</SectionContent>
		</Section>
	);
}
