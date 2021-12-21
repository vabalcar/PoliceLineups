import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class NotificationsService {
  private static readonly notificationConfiguration: MatSnackBarConfig = {
    horizontalPosition: "center",
    verticalPosition: "bottom",
    duration: 5 * 1000, // miliseconds
  };
  private static readonly notificationDismissButtonText = "OK";

  private readonly messages: Array<string>;
  private notificationsAreShowing: boolean;

  constructor(private snackBar: MatSnackBar) {
    this.messages = [];
    this.notificationsAreShowing = false;
  }

  showNotification(message: string) {
    this.messages.push(message);

    if (!this.notificationsAreShowing) {
      this.startShowingNotifications();
    }
  }

  private startShowingNotifications() {
    this.notificationsAreShowing = true;
    this.showNextNotification();
  }

  private showNextNotification(): void {
    if (this.messages.length === 0) {
      this.notificationsAreShowing = false;
      return;
    }

    this.doShowNotification(this.messages.pop());
  }

  private doShowNotification(message: string): void {
    this.snackBar
      .open(
        message,
        NotificationsService.notificationDismissButtonText,
        NotificationsService.notificationConfiguration
      )
      .afterDismissed()
      .subscribe(() => this.showNextNotification());
  }
}
