
import * as dotenv from 'dotenv';
import path from 'path';
//dotenv.config();
  
const isDocker = process.env.DOCKER === 'true';

if (!isDocker) {
  console.log('Loading local environment variables');
  dotenv.config({ path: path.resolve(__dirname, '../../.local.env') });
} else {
  console.log('port', process.env.PORT);
  dotenv.config();
}

export const SERVICES = {
  projects: isDocker
    ? 'http://projets:3002/projects'
    : process.env.PROJETS || 'http://localhost:3002/projects',

  grades: isDocker
    ? 'http://grades:3005/grades'
    : process.env.GRADES || 'http://localhost:3005/grades',

  groups: isDocker
    ? 'http://groupes:3004/groups'
    : process.env.GROUPES || 'http://localhost:3004/groups',

  users: isDocker
    ? 'http://users:3003/users'
    : process.env.USERS || 'http://localhost:3003/users',

  roles : isDocker
    ? 'http://users:3003/roles'
    : process.env.ROLES || 'http://localhost:3003/roles',

  promotions: isDocker
    ? 'http://promotions:3007/promotions'
    : process.env.PROMOTIONS || 'http://localhost:3007/promotions',

  auth: isDocker
    ? 'http://auth:3001/auth'
    : process.env.AUTH || 'http://localhost:3001/auth',

  livrables: isDocker
    ? 'http://livrables:3000/livrables'
    : process.env.LIVRABLES || 'http://localhost:3009/livrables',

  reports: isDocker
    ? 'http://reports:3006/reports'
    : process.env.REPORTS || 'http://localhost:3006/reports',
};