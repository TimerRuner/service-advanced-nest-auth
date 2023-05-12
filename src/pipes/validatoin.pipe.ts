import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);

    if (errors.length) {
      const errorMessages = errors.map(error => {
        const [propertyName] = Object.keys(error.constraints);
        return { field: propertyName, message: error.constraints[propertyName] };
      });
      throw new BadRequestException({ message: 'Validation failed', errors: errorMessages });
    }

    return value;
  }
}
