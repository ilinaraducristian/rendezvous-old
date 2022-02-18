import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsNotBlank(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isNotBlank",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== "string") return false;
          const trimmed = value.trim();
          return trimmed !== "";
        },
      },
    });
  };
}
