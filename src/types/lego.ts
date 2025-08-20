export interface LegoSet {
  set_num: string;
  name: string;
  year: number;
  theme_id: number;
  num_parts: number;
  set_img_url: string;
  set_url: string;
  last_modified_dt: string;
}

export interface RebrickableResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface SetWithStoredData extends LegoSet {
  id: number;
  setNumber: string; // From database
  dateAdded: Date;
  isStored: boolean;
  
  // Web search fallback fields
  source?: 'rebrickable' | 'web_search' | 'manual';
  confidence?: number;
  manualOverride?: boolean;
}