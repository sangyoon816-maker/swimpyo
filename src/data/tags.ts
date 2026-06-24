/**
 * Canonical place tag vocabulary. Keeping this as a closed set (rather than
 * free-form strings) is what makes tag-based filtering/recommendation
 * possible later — every place's tags are guaranteed to come from here.
 */
export const PLACE_TAGS = [
  '조용함',
  '혼자가기좋음',
  '야외',
  '실내',
  '독서',
  '노을',
  '산책',
  '피크닉',
  '반려동물',
  '한강뷰',
  '숲길',
  '전망',
  '야경',
  '사진명소',
  '감성카페',
  '넓은공간',
  '정원',
  '역사공간',
  '식물',
  '전시',
  '분수쇼',
  '자전거',
  '힐링',
  '루프탑',
  '책방',
  '한옥',
  '미술관',
] as const;

export type PlaceTag = (typeof PLACE_TAGS)[number];

/** Tags that signal a place suits a solo visit — shared by diagnosis scoring & recommend-reason copy. */
export const SOLO_FRIENDLY_TAGS: PlaceTag[] = ['조용함', '독서', '혼자가기좋음'];
