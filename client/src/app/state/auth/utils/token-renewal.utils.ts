import { Store } from "@ngrx/store";
import { AppState } from "../../app.state";
import { renewTokenAction } from "../auth.actions";

export class AuthTokenRenewalScheduler {
  private authRenewalTaskId: number | undefined;

  constructor(private store: Store<AppState>) {}

  private static countAuthRenewalDelayByTokenExpirationDateTime(
    tokenExpirationDatetime: Date
  ): number {
    const now = new Date();
    const authRenewalDelay =
      (tokenExpirationDatetime.getTime() - now.getTime()) / 2;
    return Math.max(authRenewalDelay, 0);
  }

  cancelScheduledAuthRenewal(): void {
    if (!this.authRenewalTaskId) {
      return;
    }

    window.clearTimeout(this.authRenewalTaskId);
    this.authRenewalTaskId = undefined;
  }

  scheduleAuthRenewal(tokenExpirationDatetime: Date): void {
    this.cancelScheduledAuthRenewal();

    const authRenewalDelay =
      AuthTokenRenewalScheduler.countAuthRenewalDelayByTokenExpirationDateTime(
        tokenExpirationDatetime
      );
    this.authRenewalTaskId = window.setTimeout(
      () => this.store.dispatch(renewTokenAction()),
      authRenewalDelay
    );
  }
}
