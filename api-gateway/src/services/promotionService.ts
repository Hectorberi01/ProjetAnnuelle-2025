import csvParser from "csv-parser";
import { Readable } from "stream";
import { apiClient } from "../utils/apiClient";
import { createUser, getRoleIdByName, getStudents, getUserByEmail, getUserById } from "./userService";
import * as env from "dotenv"
import { SERVICES } from "../config/services.config";
import { sendAccountCredentialsEmail, sendPromotionEnrollmentEmail } from "./notificationService";
import { getProjectsByPromotionId } from "./projectService";
import { getGroupByProjectId, getGroupByPromotionId } from "./groupService";
import { connect } from "http2";
import { User } from "../types/types";
env.config();


const URL_PROMOTIONS = SERVICES.promotions || "http://localhost:3007/promotions";
const URL_PROJECTS = SERVICES.projects || "http://localhost:3002/projects";
const URL_USERS = SERVICES.users || "http://localhost:3003/users";
const URL_GROUPS = SERVICES.groups || "http://localhost:3004/groups";
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

    if (!file) throw new Error("File is required");

    try {
        if (file.mimetype === "application/json") {
            const fileContent = file.buffer.toString("utf-8");
            students = JSON.parse(fileContent);
        } else {
            students = await parseCSV(file);
        }
        
    } catch (err) {
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
       
        if (response.status !== 201) throw new Error("Failed to create promotion");
            
        // On récupère la promotion
        const promo =  response.data
        
        // On ajoute les étudiants à la promotion
        for (const studentId of linkedUsers) {
            await addStudentToPromotion(promo.id, studentId);
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

export async function addStudentUsingCSV(promotionId: number, file: Express.Multer.File | undefined): Promise<any> {
    if (!file) throw new Error("File is required");

    let students: any[] = [];
    const existStudents: any[] = [];
    const newStudents: any[] = [];
    const linkedUsers: any[] = [];

    try {

        const promoRes = await apiClient.get<any>(`${URL_PROMOTIONS}/${promotionId}`);
        if (promoRes.status !== 200) throw new Error("Failed to fetch promotion");
        const promo = promoRes.data;

        if (file.mimetype === "application/json") {
            const fileContent = file.buffer.toString("utf-8");
            students = JSON.parse(fileContent);
        } else {
            students = await parseCSV(file);
        }

        const role = await getRoleIdByName("student".toUpperCase());

        for (const student of students) {
            const response = await getUserByEmail(student.email);
            let user;
          
            if (response !== null) {
                user = response;
                existStudents.push(user);
            } 
            else {
                student.roleId = role.id;
                const createResponse = await createUser(student);
                if (!createResponse) {
                    throw new Error("Failed to create user");
                }
                newStudents.push(createResponse);
                user = createResponse;
            }
          
            linkedUsers.push(user.id);
        }

        for (const studentId of linkedUsers) {
            await addStudentToPromotion(promotionId, studentId);
        }

        

        await Promise.all(newStudents.map(async student => {
            await sendAccountCredentialsEmail(student.email, student.username);
            await sendPromotionEnrollmentEmail(student.email, promo.name);
        }));

        await Promise.all(existStudents.map(async student => {
            await sendPromotionEnrollmentEmail(student.email, promo.name);
        }));
    } catch (error) {
        throw new Error("Failed to parse CSV");
    }

    const promises = students.map(student => addStudentToPromotion(promotionId, student.id));
    return Promise.all(promises);
}

// Add a student to a promotion
export async function addStudentToPromotion(promotionId: number, studentId: number): Promise<any> {
    try {
        const response = await apiClient.post(`${URL_PROMOTIONS}/${promotionId}/students`, { studentId });

        if (response.status !== 201) throw new Error('Failed to add student to promotion');
            
        const studentResponse = await getUserById(studentId);

        // On envoie un email à l'étudiant pour l'informer de son ajout à la promotion
        if (studentResponse) {
            await sendPromotionEnrollmentEmail(studentResponse.email, studentResponse.promotionName);
        }
        return response.data;
    } catch (error) {
        throw new Error('Failed to add student to promotion');
    }
}

export async function getPromotionById(promotionId: number): Promise<any> {
    try {
        const [promoRes, usersRes, projectsRes] = await Promise.all([
            apiClient.get<any>(`${URL_PROMOTIONS}/${promotionId}`),
            apiClient.get<User[]>(`${URL_USERS}`),
            apiClient.get(`${URL_PROJECTS}/promotion/${promotionId}`)
        ]);
        if (promoRes.status !== 200) throw new Error('Failed to fetch promotion');
        if (usersRes.status !== 200) throw new Error('Failed to fetch users');
        if (projectsRes.status !== 200) throw new Error('Failed to fetch projects');

        const students: User[] = usersRes.data.filter((user: User) => user.role.name === "student".toUpperCase());
       
        // Associer les étudiants à partir de promotionStudents
        const studentList = (
            await Promise.all(
                promoRes.data.promotionStudents?.map(async (ps: any) => {
                    return students.find((student) => student.id === ps.studentId);
                }) || []
            )
        ).filter(Boolean);

        delete promoRes.data.promotionStudents;

        return {
            ...promoRes.data,
            Students: studentList,
            Projects: projectsRes.data || [],
        };
    } catch (error) {
        throw new Error('Failed to fetch promotion by ID');
    }
}

export async function getPromotionByStudentId(studentId: number): Promise<any> {
    try {
        const response = await apiClient.get(`${URL_PROMOTIONS}/students/${studentId}`);
        if (response.status !== 200) throw new Error('Failed to fetch promotion by student ID');
    
        const promotionData: any = response.data;   

        const promotionIds = Array.isArray(promotionData) ? promotionData.map((promo: any) => promo.id) : [promotionData.id];

        const projects = await Promise.all(promotionIds.map(async (promotionId: number) => {

            const projectsList = await getProjectsByPromotionId(promotionId);

            return await Promise.all(projectsList.map(async (project: any) => {
                // Appel au service groupe
                const groups = await getGroupByProjectId(project.id);

                return { ...project, groups };
            }));
        }));
    

        // Si plusieurs promotions, on retourne un tableau enrichi
        if (Array.isArray(promotionData)) {
            return promotionData.map((promo: any, index: number) => ({
                ...promo,
                projects: projects[index]
            }));
        }

        // Sinon, promotion unique
        return {
            ...promotionData,
            projects: projects[0]
        };
    } catch (error) {
        console.error('Error fetching promotion by student ID:', error);
        throw new Error('Failed to fetch promotion by student ID');
    }
}

export async function getAllPromotions(): Promise<any[]> {
    try {

        const [promotionRes, users, projectRes] = await Promise.all([
            apiClient.get<any[]>(URL_PROMOTIONS),
            apiClient.get<User[]>(`${URL_USERS}`),
            apiClient.get<ProjectApiResponse>(URL_PROJECTS),
        ]);

        if (promotionRes.status !== 200) throw new Error('1 Échec récupération promotions');
        if (projectRes.status !== 200) throw new Error('2 Échec récupération projets');
        if (users.status !== 200) throw new Error('3 Échec récupération utilisateurs');

        const projectList = projectRes.data.projects;

        if (!Array.isArray(projectList)) throw new Error('4 Liste de projets invalide');

        const students = users.data.filter((user: User) => user.role.name === "student".toUpperCase());

        const enrichedPromotions = await Promise.all(
            promotionRes.data.map( async(promotion) => {
                const projects = await getProjectsByPromotionId(promotion.id);

                const studentList = (promotion.promotionStudents || [])
                    .map((ps: any) => students.find((s: any) => s.id === ps.studentId))
                    .filter(Boolean);

                return {
                    ...promotion,
                    students: studentList,
                    projects: projects
                };
            })
        );
        return enrichedPromotions;
    } catch (error) {
        console.error('Error fetching promotions:', error);
        throw new Error('4Failed to fetch promotions');
    }
}

export async function getAll(): Promise<any> {
    try {
        const response = await apiClient.get(`${URL_PROMOTIONS}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch promotions');
        }
        return response.data;
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

