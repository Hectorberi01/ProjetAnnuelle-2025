/*export const SERVICES = {
    projects: process.env.PROJETS || 'http://projets:3002/api/projects',
    grades: process.env.GRADE_SERVICE_URL || 'http://grades:3000/api/grades',
    groups: process.env.GROUP_SERVICE_URL || 'http://groupes:3000/api/groups',
    users: process.env.USER_SERVICE_URL || 'http://user:3000/api/users',
    promotions: process.env.PROMOTION_SERVICE_URL || 'http://promotions:3000/api/promotions',
    auth: process.env.AUTH_SERVICE_URL || 'http://auth:3000/auth',
    livrables: process.env.LIVRABLE_SERVICE_URL || 'http://livrables:3000/api/livrables',
 };*/

  
const isDocker = process.env.DOCKER === 'true';

export const SERVICES = {
  projects: isDocker
    ? 'http://projets:3002/api/projects'
    : process.env.PROJETS || 'http://localhost:3002/api/projects',

  grades: isDocker
    ? 'http://grades:3000/api/grades'
    : process.env.GRADES || 'http://localhost:3005/api/grades',

  groups: isDocker
    ? 'http://groupes:3000/api/groups'
    : process.env.GROUPES || 'http://localhost:3004/api/groups',

  users: isDocker
    ? 'http://user:3000/api/users'
    : process.env.USER || 'http://localhost:3003/api/users',

  promotions: isDocker
    ? 'http://promotions:3000/api/promotions'
    : process.env.PROMOTIONS || 'http://localhost:3007/api/promotions',

  auth: isDocker
    ? 'http://auth:3000/auth'
    : process.env.AUTH || 'http://localhost:3001/auth',

  livrables: isDocker
    ? 'http://livrables:3000/api/livrables'
    : process.env.LIVRABLES || 'http://localhost:3009/api/livrables',
};