import { hasTransition, registerTransition } from "../registry";
import { fadeTransition } from "./fade";
import { wipeTransition } from "./wipe";
import { slideTransition } from "./slide";
import { zoomTransition } from "./zoom";
import { dissolveTransition } from "./dissolve";

const defaultTransitions = [
  fadeTransition,
  wipeTransition,
  slideTransition,
  zoomTransition,
  dissolveTransition,
];

export function registerDefaultTransitions(): void {
  for (const definition of defaultTransitions) {
    if (hasTransition({ transitionType: definition.type })) {
      continue;
    }
    registerTransition({ definition });
  }
}
