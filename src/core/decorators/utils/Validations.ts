import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsEmailAddress(validationOptions?: ValidationOptions) {
    return function (object: NonNullable<unknown>, propertyName: string) {
        registerDecorator({
            name: 'isEmailAddress',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return typeof value === 'string' && emailRegex.test(value);
                },
                defaultMessage() {
                    return 'Введите валидный адресс электронной почты.';
                }
            }
        });
    };
}

export function IsPassword(validationOptions?: ValidationOptions) {
    return function (object: NonNullable<unknown>, propertyName: string) {
        registerDecorator({
            name: 'isPassword',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    const passwordRegex =
                        /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;
                    return (
                        typeof value === 'string' && passwordRegex.test(value)
                    );
                },
                defaultMessage() {
                    return (
                        'Пароль должен содержать не менее 8 символов и состоять как из букв, так и из цифр, ' +
                        'и включать в себя знаки !#$%&?'
                    );
                }
            }
        });
    };
}
