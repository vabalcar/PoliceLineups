import { Store } from "@ngrx/store";

import { AppState } from "../../app.state";
import { renewToken } from "../auth.actions";

export class TokenRenewalScheduler {
  private tokenRenewalTaskId: number | undefined;

  constructor(private store: Store<AppState>) {}

  private static countTokenRenewalDelay(tokenExpirationDatetime: Date): number {
    const now = new Date();
    const tokenRenewalDelay =
      (tokenExpirationDatetime.getTime() - now.getTime()) / 2;
    return Math.max(tokenRenewalDelay, 0);
  }

  cancelScheduledTokenRenewal(): void {
    if (!this.tokenRenewalTaskId) {
      return;
    }

    window.clearTimeout(this.tokenRenewalTaskId);
    this.tokenRenewalTaskId = undefined;
  }

  scheduleTokenRenewal(tokenExpirationDatetime: Date): void {
    this.cancelScheduledTokenRenewal();

    const tokenRenewalDelay = TokenRenewalScheduler.countTokenRenewalDelay(
      tokenExpirationDatetime
    );
    this.tokenRenewalTaskId = window.setTimeout(
      () => this.store.dispatch(renewToken()),
      tokenRenewalDelay
    );
  }
}
