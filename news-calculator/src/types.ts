export interface Measurement {
  type: "TEMP" | "HR" | "RR";
  value: number | null;
}

export interface NewsRequest {
  measurements: Measurement[];
};

export interface NewsResponse {
  score: number;
};

export interface NewsErrorData {
    status: number;
    detail: string;
};
