import { SetMetadata } from '@nestjs/common';

export const PRIVATE_KEY = '__private__';
export const Private = () => SetMetadata(PRIVATE_KEY, true);
