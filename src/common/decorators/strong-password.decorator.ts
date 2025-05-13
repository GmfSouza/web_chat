import { applyDecorators } from '@nestjs/common';
import { Matches } from 'class-validator';

export function IsStrongPasswordCustom(message?: string) {
  return applyDecorators(
    Matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.\d*)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          message ||
          'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, two numbers and one special character',
      },
    ),
  );
}
