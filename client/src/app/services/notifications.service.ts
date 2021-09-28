import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class NotificationsService {
  constructor(private snackBar: MatSnackBar) {}

  showNotification(message: string) {
    this.snackBar.open(message, "OK", {
      horizontalPosition: "center",
      verticalPosition: "bottom",
      duration: 5 * 1000, // miliseconds
    });
  }
}
