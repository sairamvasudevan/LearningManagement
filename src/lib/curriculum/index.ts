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
};
