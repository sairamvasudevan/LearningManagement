import type { ModuleCurriculum } from "./types";
import { module01 } from "./module-01";
import { module02 } from "./module-02";
import { module03 } from "./module-03";
import { module04 } from "./module-04";
import { module05 } from "./module-05";
import { module06 } from "./module-06";
import { module07 } from "./module-07";
import { module08 } from "./module-08";
import { module09 } from "./module-09";
import { module10 } from "./module-10";

import { stage02Modules } from "./stage-02";
import { stage03Modules } from "./stage-03";
import { stage04Modules } from "./stage-04";
import { stage05Modules } from "./stage-05";
import { stage06Modules } from "./stage-06";
import { stage07Modules } from "./stage-07";
import { stage08Modules } from "./stage-08";
import { stage09Modules } from "./stage-09";
import { stage10Modules } from "./stage-10";

export * from "./types";

export const MODULES_CURRICULUM: Record<number, ModuleCurriculum> = {
  1: module01,
  2: module02,
  3: module03,
  4: module04,
  5: module05,
  6: module06,
  7: module07,
  8: module08,
  9: module09,
  10: module10,
  ...stage02Modules,
  ...stage03Modules,
  ...stage04Modules,
  ...stage05Modules,
  ...stage06Modules,
  ...stage07Modules,
  ...stage08Modules,
  ...stage09Modules,
  ...stage10Modules,
};
