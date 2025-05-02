import { HttpService } from "@nestjs/axios";
import { SERVICES } from "../../config/services.config";
import { GatewayProjectService } from "../projets/gateway.project.service";
import { CreatePromotion, Promotion } from "src/types/types";
import * as fs from "fs";
//import * as csvParser from 'csv-parser';
import csvParser from "csv-parser";
import { GatewayUsersService } from "../user/gateway.users.service";
import { Readable } from "stream";



export class GatewayPromotionService {
    public constructor(private readonly httpService: HttpService,) {}

    private readonly gatewayProjectService = new GatewayProjectService(this.httpService);
    private readonly userService = new GatewayUsersService(this.httpService);

    private parseCSV(file: Express.Multer.File): Promise<any[]> {
        return new Promise((resolve, reject) => {
          const results: any[] = [];
          const stream = Readable.from(file.buffer.toString("latin1"));

          stream
            .pipe(csvParser({ separator: ";" }))
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", reject);
        });      
    }
    // Create a new promotion
    public async createPromotion(promotion:any, file:Express.Multer.File): Promise<Promotion> {
        let students: any[] = [];
        try {
            if (file.mimetype === "application/json") {
              const fileContent = file.buffer.toString("utf-8");
              students = JSON.parse(fileContent);
            } else {
              students = await this.parseCSV(file);
            }
            console.log("students", students);
          } catch (err) {
            console.error("Erreur pendant la lecture du fichier : ", err);
            throw new Error("Impossible de lire le fichier étudiants");
        }

        // récupère l'id du role étudiant
        const role = await this.userService.getRoleIdByName("student");
        console.log("role", role);

        try {
            const linkedUsers: any[] = [];

            //on fait appel au service utiliateur pour créer l'utilisateur

            console.log("students");
            for (const student of students) {
                const response = await this.userService.getUserByEmail(student.email);
                let user;
          
                if (response !== null) {
                  user = response;
                } 
                else {
                    student.roleId = role.id;
                    const createResponse = await this.userService.createUser(student);
                    if (!createResponse) {
                        throw new Error("Failed to create user");
                    }
                    user = createResponse;
                }
          
                linkedUsers.push(user.id);
            }

            // on créer la promotion
            const response = await fetch(`${SERVICES.promotions}`, {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(promotion),
            });

            console.log("response", response);
    
            if (!response.ok) {
                throw new Error("Failed to create promotion");
            }
            // On récupère la promotion
            const promo = await response.json();

            console.log("promo", promo);
            // On ajoute les étudiants à la promotion
            for (const studentId of linkedUsers) {
                const etudentResponse = await this.addStudentToPromotion(promo.id, studentId);
                console.log("etudentResponse", etudentResponse);
            }

            return promo;
        }catch (error) {
            throw new Error("Failed to create promotion");
        }
    }

    // Add a student to a promotion
    public async addStudentToPromotion(promotionId: number, studentId: number){
        try {
            const response = await fetch(`${SERVICES.promotions}/${promotionId}/students`, {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify({studentId: studentId}),
            });
            if (!response.ok) {
                throw new Error("Failed to add student to promotion");
            }
            return await response.json();
        }catch (error) {
            throw new Error("Failed to add student to promotion");
        }
    }

    // GET all promotions
    public async getAllPromotions() {
        try {
            const response = await fetch((`${SERVICES.promotions}`));
            if (!response) {
                throw new Error("Failed to fetch promotions dans le service");
            }
            const promotions = await response.json();

            // on récupère les étudiants de chaque promotion
            const students  = await this.userService.Students()

            // on récupère les projets de chaque promotion
            const projects = await this.gatewayProjectService.getAllProjects();

            // 3. Remplacer promotionStudents par l'objet complet de l'étudiant
            // Construire la réponse enrichie
            const updatedPromotions = promotions.map((promotion: any) => {
                return {
                  id: promotion.id,
                  name: promotion.name,
                  startYear: promotion.startYear,
                  endYear: promotion.endYear,
                  createdAt: promotion.createdAt,
          
                  // Liste des étudiants attachés à la promotion
                  Students: promotion.promotionStudents.map((ps: any) => {
                    const student = students.find((s: any) => s.id === ps.studentId);
                    return student || ps;
                  }),
          
                  // Liste des projets attachés à la promotion
                  Projects: projects.filter((project: any) => project.promotionId === promotion.id),
                };
            });
  
            return updatedPromotions;
        }catch (error) {
            throw new Error("Failed to fetch promotions");
        }
    }

    // GET a promotion by ID
    public async getPromotionById(promotionId: number){
        try {
            const response = await fetch(`${SERVICES.promotions}/${promotionId}`);
            if (!response) {
                throw new Error("Failed to fetch promotion");
            }

            const promotion = await response.json();
            console.log("promotion", promotion);

            const students  = await this.userService.Students()
            console.log("students", students);

            const projects = await this.gatewayProjectService.getAllProjects();
            console.log("projects", projects);

            const updatedPromotion = {
                id: promotion.id,
                name: promotion.name,
                startYear: promotion.startYear,
                endYear: promotion.endYear,
                createdAt: promotion.createdAt,

                Students: promotion.promotionStudents.map((ps: any) => {
                    const student = students.find((s: any) => s.id === ps.studentId);
                    return student || ps;
                }),

                Projects: projects.filter((project: any) => project.promotionId === promotion.id),
            };

  
            return updatedPromotion;
            //return await response.json();
        }catch (error) {
        throw new Error("Failed to fetch promotion, promotionId: " + promotionId);
        }
    }
    // Update a promotion
    public async updatePromotion(promotionId: number, promotion: any){
        try {
            const response = await fetch(`${SERVICES.promotions}/${promotionId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(promotion),
            });
    
            if (!response.ok) {
                throw new Error("Failed to update promotion");
            }
            return await response.json();
        }catch (error) {
            throw new Error("Failed to update promotion");
        }
    }
    // Delete a promotion
    public async deletePromotion(promotionId: number){
        try {
            const response = await fetch(`${SERVICES.promotions}/${promotionId}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json",},
            });
    
            if (!response.ok) {
                throw new Error("Failed to delete promotion");
            }
        }catch (error) {
            throw new Error("Failed to delete promotion");
        }
    }
}