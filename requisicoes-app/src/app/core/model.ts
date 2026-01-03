import { classToPlain } from 'class-transformer';

export abstract class Model {
  id: string;

  toObject(): object {
    const obj: any = classToPlain(this);
    delete obj.id;
    return obj;
  }
}
