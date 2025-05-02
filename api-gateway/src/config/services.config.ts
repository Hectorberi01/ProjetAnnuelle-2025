
import * as dotenv from 'dotenv';
dotenv.config();
  
const isDocker = process.env.DOCKER === 'true';
export const SERVICES = {
  projects: isDocker
    ? 'http://projets:3002/api/projects'
    : process.env.PROJETS || 'http://localhost:3002/api/projects',

  grades: isDocker
    ? 'http://grades:3000/api/grades'
    : process.env.GRADES || 'http://localhost:3005/api/grades',

  groups: isDocker
    ? 'http://groupes:3004/api/groups'
    : process.env.GROUPES || 'http://localhost:3004/api/groups',

  users: isDocker
    ? 'http://users:3003/users'
    : process.env.USER || 'http://localhost:3003/users',

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
};