import { HttpService } from "@nestjs/axios";
import { SERVICES } from "../../config/services.config";

export class GatewayGroupService {
  constructor(private readonly httpService: HttpService) {}

  // Define methods for group-related operations
    async getGroupById(groupId: string) {
        try {
            const res = await fetch(`${SERVICES.groups}/${groupId}`);
            if (!res.ok) {
                throw new Error("Failed to fetch group");
            }
            return await res.json();
        } catch (error) {
            throw new Error("Failed to fetch group, groupId: " + groupId);
        }
    }
    async getAllGroups() {
        try {
            const res = await fetch(`${SERVICES.groups}`);
            if (!res.ok) {
                throw new Error("Failed to fetch groups");
            }

            const groups = await res.json();

            // On récupère les projets
            const resProjects = await fetch((`${SERVICES.projects}`));
            if (!resProjects.ok) {
                throw new Error("Failed to fetch projects");
            }

            const projects = await resProjects.json();

            // pour chaque projet on récupère la promotion
            const promotions = await fetch((`${SERVICES.promotions}`));
            if (!promotions.ok) {
                throw new Error("Failed to fetch promotions");
            }

            const promotionsJson = await promotions.json();
            
            const updateProjects = projects.map((project: any) => {
                const promotion = promotionsJson.find((promo: any) => promo.id === project.promotionId);
                return {
                    id: project.id,
                    name: project.name,
                    description: project.description,
                    status: project.status,
                    promotion: promotion || null,
                };
            });

            //console.log("updateProjects", updateProjects);
            
            const allusers = await fetch(`${SERVICES.users}`);
            if (!allusers.ok) {
                throw new Error("Failed to fetch users");
            }
            const allusersJson = await allusers.json();
            const studentsList = allusersJson.filter((user: any) => user.role.name === "student");

            //const students = await this.userService.Students();
            const updatedGroups = groups.map((group: any) => {
                return {
                  id: group.id,
                  name: group.name,
                  createdAt: group.createdAt,
                  project: updateProjects.find((project: any) => project.id === group.projectId) || null,
                  Students: (group.groupStudent || []).map((gs: any) => {
                    const student = studentsList.find((s: any) => s.id === gs.studentId);
                    return student || null;
                  }).filter((s: any) => s !== null),
                };
              });
          
            return updatedGroups;

        } catch (error) {
            throw new Error("Failed to fetch groups");
        }
    }
    async getGroupByName(name: string) {
        try {
            const res = await fetch(`${SERVICES.groups}/name/${name}`);
            if (!res.ok) {
                throw new Error("Failed to fetch group");
            }
            return await res.json();
        } catch (error) {
            throw new Error("Failed to fetch group, name: " + name);
        }
    }
    async getGroupByPromotionId(promotionId: string) {
        try {
            const res = await fetch(`${SERVICES.groups}/promotion/${promotionId}`);
            if (!res.ok) {
                throw new Error("Failed to fetch group");
            }
            return await res.json();
        } catch (error) {
            throw new Error("Failed to fetch group, promotionId: " + promotionId);
        }
    }
}