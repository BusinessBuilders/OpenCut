import type {
	ImageElement,
	StickerElement,
	VideoElement,
} from "@/types/timeline";
import { BlendingSection, ColorGradingSection, TransformSection } from "./sections";

export function VideoProperties({
	element,
	trackId,
}: {
	element: VideoElement | ImageElement | StickerElement;
	trackId: string;
}) {
	const showColorGrading = element.type === "video" || element.type === "image";

	return (
		<div className="flex h-full flex-col">
			<TransformSection
				element={element}
				trackId={trackId}
				showTopBorder={false}
			/>
			<BlendingSection element={element} trackId={trackId} />
			{showColorGrading && (
				<ColorGradingSection element={element} trackId={trackId} />
			)}
		</div>
	);
}
