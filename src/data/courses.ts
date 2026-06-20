import type { Course } from '@/types';
import { PLACES } from './places';

export const COURSES: Course[] = [
  {
    id: 'c1',
    name: '한강 노을 힐링 코스',
    description: '선유도공원에서 시작해 반포 한강공원까지 이어지는 노을빛 힐링 산책 코스. 저녁 무렵 걸으면 하루의 피로가 씻겨나갑니다.',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    totalDistance: 4.2,
    estimatedTime: 90,
    difficulty: 'easy',
    restScore: 9.3,
    tags: ['노을', '한강', '여유', '저녁산책'],
    emotions: ['tired', 'stressed', 'just-rest'],
    reviewCount: 156,
    places: [
      { order: 1, place: PLACES[0], stayDuration: 40, memo: '공원 한 바퀴 산책' },
      { order: 2, place: PLACES[3], stayDuration: 30, memo: '커피 한 잔 휴식' },
      { order: 3, place: PLACES[7], stayDuration: 20, memo: '노을 감상 & 분수쇼' },
    ],
  },
  {
    id: 'c2',
    name: '종로 감성 산책 코스',
    description: '정독도서관 정원에서 시작해 국립현대미술관을 거쳐 북촌을 산책하는 문화 코스. 천천히 걷다보면 복잡한 생각이 정리됩니다.',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600',
    totalDistance: 2.1,
    estimatedTime: 120,
    difficulty: 'easy',
    restScore: 9.0,
    tags: ['문화', '조용한', '예술', '역사'],
    emotions: ['need-clarity', 'depressed', 'just-rest'],
    reviewCount: 89,
    places: [
      { order: 1, place: PLACES[4], stayDuration: 60, memo: '정원 산책 및 독서' },
      { order: 2, place: PLACES[6], stayDuration: 60, memo: '미술관 관람' },
    ],
  },
  {
    id: 'c3',
    name: '도심 속 나만의 쉼터 코스',
    description: '서울로 7017에서 시작해 남산 팔각정까지 올라가는 도심 힐링 코스. 낮은 곳에서 높은 곳으로 올라가며 시야가 트이는 경험을 합니다.',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600',
    totalDistance: 3.5,
    estimatedTime: 100,
    difficulty: 'medium',
    restScore: 8.8,
    tags: ['뷰', '야경', '도심', '특별한'],
    emotions: ['stressed', 'need-clarity'],
    reviewCount: 112,
    places: [
      { order: 1, place: PLACES[5], stayDuration: 30, memo: '서울로 산책' },
      { order: 2, place: PLACES[2], stayDuration: 40, memo: '남산 전망 감상' },
    ],
  },
];

export const getCourseById = (id: string) =>
  COURSES.find((c) => c.id === id);
