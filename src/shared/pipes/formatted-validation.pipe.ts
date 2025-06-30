import { BadRequestException } from '@nestjs/common';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common/interfaces';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class FormattedValidationPipe implements PipeTransform {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length <= 0) {
      return value;
    }

    const formattedErrors = errors.reduce((acc, error) => {
      if (error.constraints !== undefined) {
        Reflect.defineProperty(acc, error.property, {
          writable: true,
          enumerable: true,
          value: Object.values(error.constraints).join(', '),
        });
      }

      return acc;
    }, {});

    throw new BadRequestException(formattedErrors);
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
