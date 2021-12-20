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

export type ValidationError =
  | ["required", RequiredValidationErrorProps]
  | ["minlength", LengthValidationErrorProps]
  | ["maxlength", LengthValidationErrorProps]
  | ["email", EmailValidationErrorProps];
