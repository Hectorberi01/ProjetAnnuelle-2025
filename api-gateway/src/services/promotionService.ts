import csvParser from "csv-parser";
import { Readable } from "stream";
import { apiClient } from "../utils/apiClient";
import { createUser, getRoleIdByName, getStudents, getUserByEmail } from "./userService";
import * as env from "dotenv"
import { SERVICES } from "../config/services.config";
import { sendAccountCredentialsEmail, sendPromotionEnrollmentEmail } from "./notificationService";
import { getProjectsByPromotionId } from "./projectService";
env.config();


const URL_PROMOTIONS = SERVICES.promotions || "http://localhost:3007/promotions";
const URL_PROJECTS = SERVICES.projects || "http://localhost:3002/projects";
interface Project {
  id: number;
  name: string;
  description: string;
  promotionId: number;
  soutenanceDate: string | null;
  minStudents: number;
  maxStudents: number;
  deadline: string | null;
  allowLate: boolean;
  latePenaltyPerHour: number | null;
  mode: 'random' | 'manual' | 'free';
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'visible';
}

interface ProjectApiResponse {
  projects: Project[];
  total: number;
  page: number;
  lastPage: number;
}

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
    const linkedUsers: any[] = [];
    const existStudents: any[] = [];
    const newStudents: any[] = [];

    try {

        for (const student of students) {
            const response = await getUserByEmail(student.email);
            let user;
          
            if (response !== null) {
                user = response;
                existStudents.push(user);
            } 
            else {
                student.roleId = roleId;
                const createResponse = await createUser(student);
                if (!createResponse) {
                    throw new Error("Failed to create user");
                }
                newStudents.push(createResponse);
                user = createResponse;
            }
          
            linkedUsers.push(user.id);
        }

        const response = await apiClient.post<any>(`${URL_PROMOTIONS}`, promotion);
       
        if (response.status !== 201) {
            throw new Error("Failed to create promotion");
        }
    
        // On récupère la promotion
        const promo =  response.data
        
        // On ajoute les étudiants à la promotion
        for (const studentId of linkedUsers) {
            const etudentResponse = await addStudentToPromotion(promo.id, studentId);
            console.log("etudentResponse", etudentResponse);
        }

        await Promise.all(newStudents.map(async student => {
            await sendAccountCredentialsEmail(student.email, student.username);
            await sendPromotionEnrollmentEmail(student.email, promo.name);
        }));

        await Promise.all(existStudents.map(async student => {
            await sendPromotionEnrollmentEmail(student.email, promo.name);
        }));


        return promo;
    }catch (error) {
        throw new Error("Failed to create promotion");
    }
}

// Add a student to a promotion
export async function addStudentToPromotion(promotionId: number, studentId: number): Promise<any> {
    console.log(`${URL_PROMOTIONS}/${promotionId}/students`)
    try {
        const response = await apiClient.post(`${URL_PROMOTIONS}/${promotionId}/students`, { studentId });
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
    console.log('URL',`${URL_PROMOTIONS}/${promotionId}`)
    try {
        const response = await apiClient.get(`${URL_PROMOTIONS}/${promotionId}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch promotion');
        }

        const promotionData: any = response.data;

        console.log("promotionData", promotionData);
        // on récupère les étudiants de la promotion
        const students = await getStudents();
        console.log("students", students);

        // on récupère les projets de la promotion
        const projects = await getProjectsByPromotionId(promotionId);
        console.log("projects", projects);
        // Associer les étudiants à partir de promotionStudents
        const studentList = (
            await Promise.all(
                promotionData.promotionStudents?.map(async (ps: any) => {
                    return students.find((student) => student.id === ps.studentId);
                }) || []
            )
        ).filter(Boolean);

        console.log("studentList", studentList);
        delete promotionData.promotionStudents;

        return {
            ...promotionData,
            Students: studentList,
            Projects: projects,
        };
    } catch (error) {
        console.error('Error fetching promotion by ID:', error);
        throw new Error('Failed to fetch promotion by ID');
    }
}
export async function getAllPromotions(): Promise<any[]> {
    try {
        console.log("SERVICES.promotions", URL_PROMOTIONS);
        const response = await apiClient.get<any[]>(`${URL_PROMOTIONS}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch promotions');
        }
        // on récupère les étudiants de la promotion
        const students =  await getStudents()

        // on récupère le nombre de projets de chaque promotion
        const projects = await apiClient.get<ProjectApiResponse>(`${URL_PROJECTS}`);
        if (projects.status !== 200) {
            throw new Error('Failed to fetch projects');
        }

        const projectList = projects.data.projects;

        if (!Array.isArray(projectList)) {
            throw new Error('Projects is not an array');
        }

        console.log("data", projectList);
        
        // Regroupement des projets par ID de promotion
        const projectsByPromotionId = projectList.reduce((acc: any, project: any) => {
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
        const response = await apiClient.put(`${URL_PROMOTIONS}/${promotionId}`, promotionData);
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
        const response = await apiClient.delete(`${URL_PROMOTIONS}/${promotionId}`);
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
