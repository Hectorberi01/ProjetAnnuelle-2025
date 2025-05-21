import csvParser from "csv-parser";
import { Readable } from "stream";
import { apiClient } from "../utils/apiClient";
import { createUser, getRoleIdByName, getStudents, getUserByEmail } from "./userService";
import * as env from "dotenv"
import { SERVICES } from "../config/services.config";
env.config();


export async function parseCSV(file: Express.Multer.File): Promise<any[]> {
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

export async function  createPromotion(promotion:any, file:Express.Multer.File | undefined): Promise<any> {
    let students: any[] = [];

    if (!file) {
        throw new Error("File is required");
    }

    try {
        if (file.mimetype === "application/json") {
            const fileContent = file.buffer.toString("utf-8");
            students = JSON.parse(fileContent);
        } else {
            students = await parseCSV(file);
        }
        
    } catch (err) {
        console.error("Erreur pendant la lecture du fichier : ", err);
        throw new Error("Impossible de lire le fichier étudiants");
    }

    // récupère l'id du role étudiant
    const role = await getRoleIdByName("student")

    const roleId = role.id;

    try {
        const linkedUsers: any[] = [];
        //on fait appel au service utiliateur pour créer l'utilisateur

        for (const student of students) {
            const response = await getUserByEmail(student.email);
            let user;
          
            if (response !== null) {
                user = response;
            } 
            else {
                student.roleId = roleId;
                const createResponse = await createUser(student);
                if (!createResponse) {
                    throw new Error("Failed to create user");
                }
                user = createResponse;
            }
          
            linkedUsers.push(user.id);
        }

        const response = await apiClient.post<any>(`${SERVICES.promotions}`, promotion);
       
        if (response.status !== 201) {
            throw new Error("Failed to create promotion");
        }
    
        // On récupère la promotion
        const promo =  response.data
        console.log("linkedUsers", linkedUsers);

        console.log("promo", promo);
        // On ajoute les étudiants à la promotion
        for (const studentId of linkedUsers) {
            const etudentResponse = await addStudentToPromotion(promo.id, studentId);
            console.log("etudentResponse", etudentResponse);
        }

        return promo;
    }catch (error) {
        throw new Error("Failed to create promotion");
    }
}

//     // Add a student to a promotion
 export async function  addStudentToPromotion(promotionId: number, studentId: number): Promise<any> {
    console.log(`${SERVICES.promotions}/${promotionId}/students`)
    try {
        const response = await apiClient.post(`${SERVICES.promotions}/${promotionId}/students`, { studentId });
        if (response.status !== 201) {
            throw new Error('Failed to add student to promotion');
        }
        return response.data;
    } catch (error) {
        console.error('Error adding student to promotion:', error);
        throw new Error('Failed to add student to promotion');
    }
}

export async function getPromotionById(promotionId: number): Promise<any> {
    let response : any = {}
    try {
        response = await apiClient.get(`${SERVICES.promotions}/${promotionId}`);
        if (response.status !== 200) {
            return response;
        }
        return response;
    } catch (error) {
        return response;
    }
}
export async function getAllPromotions(): Promise<any[]> {
    try {
        console.log("SERVICES.promotions", SERVICES.promotions);
        const response = await apiClient.get<any[]>(`${SERVICES.promotions}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch promotions');
        }
        // on récupère les étudiants de la promotion
        const students =  await getStudents()

        // on récupère le nombre de projets de chaque promotion
        const projects = await apiClient.get<any[]>(`${SERVICES.projects}`);
        if (projects.status !== 200) {
            throw new Error('Failed to fetch projects');
        }
        
        // Regroupement des projets par ID de promotion
        const projectsByPromotionId = projects.data.reduce((acc: any, project: any) => {
            if (!acc[project.promotionId]) {
                acc[project.promotionId] = 0;
            }
            acc[project.promotionId]++;
            return acc;
        }, {});


        // Enrichir les promotions avec les étudiants et le nombre de projets
        const promotionsWithStudents = response.data.map(promotion => {
        const studentList = promotion.promotionStudents?.map((ps: any) => {
            return students.find(student => student.id === ps.studentId);
        }).filter(Boolean) || [];

        return {
            ...promotion,
            students: studentList, // Liste réelle des étudiants
            numberOfProjects: projectsByPromotionId[promotion.id] || 0,
            promotionStudents: undefined // Nettoyage éventuel
        };
        });

        return promotionsWithStudents;
    } catch (error) {
        console.error('Error fetching promotions:', error);
        throw new Error('Failed to fetch promotions');
    }
}

export async function updatePromotion(promotionId: number, promotionData: any): Promise<any> {
    try {
        const response = await apiClient.put(`${SERVICES.promotions}/${promotionId}`, promotionData);
        if (response.status !== 200) {
            throw new Error('Failed to update promotion');
        }
        return response.data;
    } catch (error) {
        console.error('Error updating promotion:', error);
        throw new Error('Failed to update promotion');
    }
}

export async function deletePromotion(promotionId: number): Promise<any> {
    try {
        const response = await apiClient.delete(`${SERVICES.promotions}/${promotionId}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete promotion');
        }
        return response.data;
    } catch (error) {
        console.error('Error deleting promotion:', error);
        throw new Error('Failed to delete promotion');
    }
}

// export async function getPromotionByName(promotionName: string): Promise<any> {
//     try {
//         const response = await apiClient.get(`${SERVICES.promotions}/name/${promotionName}`);
//         if (response.status !== 200) {
//             throw new Error('Failed to fetch promotion by name');
//         }
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching promotion by name:', error);
//         throw new Error('Failed to fetch promotion by name');
//     }
// }
