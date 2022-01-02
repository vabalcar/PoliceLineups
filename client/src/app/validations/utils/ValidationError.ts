export type RequiredValidationErrorProps = {
  required: boolean;
};

export type LengthValidationErrorProps = {
  requiredLength: number;
  actualLength: number;
};

export type EmailValidationErrorProps = {
  email: boolean;
};

export type MatDatePickerValidationErrorProps = {
  text: string;
};

export type ValidationError =
  | ["required", RequiredValidationErrorProps]
  | ["minlength", LengthValidationErrorProps]
  | ["maxlength", LengthValidationErrorProps]
  | ["email", EmailValidationErrorProps]
  | ["matDatepickerParse", MatDatePickerValidationErrorProps];
