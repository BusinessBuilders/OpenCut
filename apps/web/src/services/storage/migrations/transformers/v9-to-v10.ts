import type { MigrationResult, ProjectRecord } from "./types";
import { getProjectId } from "./utils";

export function transformProjectV9ToV10({
	project,
}: {
	project: ProjectRecord;
}): MigrationResult<ProjectRecord> {
	const projectId = getProjectId({ project });
	if (!projectId) {
		return { project, skipped: true, reason: "no project id" };
	}

	if (isV10Project({ project })) {
		return { project, skipped: true, reason: "already v10" };
	}

	// All new fields (inTransition, speedCurve, reversed, colorAdjustments, fade,
	// textAnimation) are optional and default to undefined — no data transformation needed.
	return {
		project: { ...project, version: 10 },
		skipped: false,
	};
}

function isV10Project({ project }: { project: ProjectRecord }): boolean {
	return typeof project.version === "number" && project.version >= 10;
}
