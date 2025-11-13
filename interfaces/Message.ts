export interface Message {
  _id?: string;
  from: string;
  to: string;
  message: string;
  timestamp: Date;
}
