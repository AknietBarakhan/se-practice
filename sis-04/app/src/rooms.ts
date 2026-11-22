export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: { start: number; end: number }[]; // minutes after midnight, 600 = 10:00
};

export const ROOMS: Room[] = [
  {
    id: 'room-101',
    name: 'Room 101 — Study Pod',
    capacity: 4,
    equipment: ['whiteboard'],
    blocked: false,
    bookings: [
      { start: 600, end: 660 }, // 10:00–11:00
    ],
  },
  {
    id: 'room-202',
    name: 'Room 202 — Seminar Room',
    capacity: 12,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    bookings: [
      { start: 720, end: 780 }, // 12:00–13:00
    ],
  },
  {
    id: 'room-305',
    name: 'Room 305 — Lecture Lab',
    capacity: 30,
    equipment: ['projector', 'whiteboard', 'video-conference'],
    blocked: false,
    bookings: [],
  },
  {
    id: 'room-404',
    name: 'Room 404 — Maintenance Hall',
    capacity: 20,
    equipment: ['projector', 'video-conference'],
    blocked: true,
    bookings: [],
  },
];
