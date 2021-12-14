export type RequiredValidationErrorProps = {
  required: boolean;
};

export type MinLengthValidationErrorProps = {
  requiredLength: number;
  actualLength: number;
};

export type ValidationError =
  | ["required", RequiredValidationErrorProps]
  | ["minlength", MinLengthValidationErrorProps];
