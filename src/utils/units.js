import unitPageMetadata from "../assets/unit_page/unit_card_metadata.js";
import { getRecords } from "./records";

// 유닛이 잠겨 있는지 확인해요. requires가 있으면 그 유닛의 용어 퀴즈를 모두 맞혀야 열려요
export function isUnitLocked(unit) {
  if (unit.locked) return true;
  if (!unit.requires) return false;

  const { terms } = getRecords();
  return !unitPageMetadata[unit.requires].chapters.every(
    (chapter) => terms[chapter.segment]?.correct
  );
}
