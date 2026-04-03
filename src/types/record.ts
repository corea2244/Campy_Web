export type RecordDateType = "single" | "range";

export interface RecordLocation {
  placeName: string;
  address?: string;
  latitude: number;
  longitude: number;
}

export interface RecordPhoto {
  uri: string;
  fileName?: string;
}

export interface CampRecordDraft {
  title: string;
  content: string;
  dateType: RecordDateType;
  startDate: string;
  endDate?: string | null;
  location: RecordLocation | null;
  photos: RecordPhoto[];
}
