export interface RecordingSession {
  id: string;
  date: string; // ISO string
  transcript: string;
  duration: number; // in seconds
  language: string;
}
