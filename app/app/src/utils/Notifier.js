import { NotificationManager } from "react-notifications";

export class Notifier {
  static createNotification = (
    type,
    title = "",
    message = "",
    timeout = 3000
  ) => {
    switch (type) {
      case "info":
        NotificationManager.info(message, title, timeout);
        break;
      case "success":
        NotificationManager.success(message, title, timeout);
        break;
      case "warning":
        NotificationManager.warning(message, title, timeout);
        break;
      case "error":
        NotificationManager.error(message, title, timeout);
        break;
      default:
        break;
    }
  };
}
