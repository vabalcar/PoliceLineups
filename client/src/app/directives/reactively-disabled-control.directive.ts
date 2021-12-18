import { Directive, Input } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: "([formControl])[appReactivelyDisabled]",
})
export class ReactivelyDisabledControlDirective {
  @Input()
  set appReactivelyDisabled(value: boolean) {
    if (value) {
      this.ngControl.control.disable();
    } else {
      this.ngControl.control.enable();
    }
  }

  constructor(private readonly ngControl: NgControl) {}
}
