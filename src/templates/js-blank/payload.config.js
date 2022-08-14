import { buildConfig } from 'payload/config';
import Users from './collections/Users';
/*IMPORT_COLLECTIONS*/

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    /*COLLECTIONS*/
  ],
});
