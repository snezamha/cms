import { ExtendedUser } from './types';

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
