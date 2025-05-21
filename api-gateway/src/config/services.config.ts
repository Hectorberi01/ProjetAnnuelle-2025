
import * as dotenv from 'dotenv';
import path from 'path';
//dotenv.config();
  
const isDocker = process.env.DOCKER === 'true';

console.log('isDocker:', isDocker);
// Charge .local.env si on n'est PAS en docker
if (!isDocker) {
  console.log('Loading local environment variables');
  dotenv.config({ path: path.resolve(__dirname, '../../.local.env') });
} else {
  dotenv.config(); // par défaut, charge .env
}

export const SERVICES = {
  projects: isDocker
    ? 'http://projets:3002/api/projects'
    : process.env.PROJETS || 'http://localhost:3002/api/projects',

  grades: isDocker
    ? 'http://grades:3005/api/grades'
    : process.env.GRADES || 'http://localhost:3005/api/grades',

  groups: isDocker
    ? 'http://groupes:3004/api/groups'
    : process.env.GROUPES || 'http://localhost:3004/api/groups',

  users: isDocker
    ? 'http://users:3003/users'
    : process.env.USERS || 'http://localhost:3003/users',

  roles : isDocker
    ? 'http://users:3003/roles'
    : process.env.ROLES || 'http://localhost:3003/roles',
    
  promotions: isDocker
    ? 'http://promotions:3007/api/promotions'
    : process.env.PROMOTIONS || 'http://localhost:3007/api/promotions',

  auth: isDocker
    ? 'http://auth:3001/api/auth'
    : process.env.AUTH || 'http://localhost:3001/api/auth',

  livrables: isDocker
    ? 'http://livrables:3000/api/livrables'
    : process.env.LIVRABLES || 'http://localhost:3009/api/livrables',

  reports: isDocker
    ? 'http://reports:3006/api/reports'
    : process.env.REPORTS || 'http://localhost:3006/api/reports',
};