"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICES = void 0;
const isDocker = process.env.DOCKER === 'true';
exports.SERVICES = {
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
//# sourceMappingURL=services.config.js.map