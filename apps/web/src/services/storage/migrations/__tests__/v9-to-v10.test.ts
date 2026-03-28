import { describe, expect, test } from "bun:test";
import { transformProjectV9ToV10 } from "../transformers/v9-to-v10";

const v9Project = {
	id: "project-v9",
	version: 9,
	metadata: {
		id: "project-v9",
		name: "V9 Project",
		createdAt: "2024-01-01T00:00:00.000Z",
		updatedAt: "2024-01-01T00:00:00.000Z",
	},
	settings: {
		fps: 30,
		canvasSize: { width: 1920, height: 1080 },
		background: { type: "color", color: "#000000" },
	},
	currentSceneId: "scene-main",
	scenes: [
		{
			id: "scene-main",
			name: "Main scene",
			isMain: true,
			tracks: [
				{
					id: "track-video",
					type: "video",
					name: "Video Track",
					isMain: true,
					elements: [
						{
							id: "el-1",
							type: "video",
							startTime: 0,
							duration: 5,
						},
					],
				},
			],
			bookmarks: [],
			createdAt: "2024-01-01T00:00:00.000Z",
			updatedAt: "2024-01-01T00:00:00.000Z",
		},
	],
} as Parameters<typeof transformProjectV9ToV10>[0]["project"];

describe("V9 to V10 Migration", () => {
	test("bumps version to 10 and preserves all existing data", () => {
		const result = transformProjectV9ToV10({ project: v9Project });

		expect(result.skipped).toBe(false);
		expect(result.project.version).toBe(10);

		// All other fields are preserved unchanged
		expect(result.project.id).toBe(v9Project.id);
		expect(result.project.metadata).toEqual(v9Project.metadata);
		expect(result.project.settings).toEqual(v9Project.settings);
		expect(result.project.scenes).toEqual(v9Project.scenes);
	});

	test("skips projects that are already v10", () => {
		const result = transformProjectV9ToV10({
			project: { ...v9Project, version: 10 },
		});

		expect(result.skipped).toBe(true);
		expect(result.reason).toBe("already v10");
	});

	test("skips projects with version higher than 10", () => {
		const result = transformProjectV9ToV10({
			project: { ...v9Project, version: 11 },
		});

		expect(result.skipped).toBe(true);
		expect(result.reason).toBe("already v10");
	});

	test("skips projects with no id", () => {
		const result = transformProjectV9ToV10({
			project: {
				version: 9,
				scenes: [],
			} as Parameters<typeof transformProjectV9ToV10>[0]["project"],
		});

		expect(result.skipped).toBe(true);
		expect(result.reason).toBe("no project id");
	});
});
