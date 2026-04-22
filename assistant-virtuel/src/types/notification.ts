export interface Notification {
  type: "new-feedback" | "update-feedback" | "delete-feedback";
  message: string;
  content?: string;
  date: string;
}
