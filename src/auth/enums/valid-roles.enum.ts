import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  superUser = 'superUser',
}

registerEnumType(ValidRoles, {
  name: 'ValidRoles',
  description:
    'In officia in eu cillum nulla esse ullamco Lorem excepteur excepteur nostrud sit.',
});
