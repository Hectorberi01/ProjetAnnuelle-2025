import { Router } from "express";
import { createProject, deleteProject, getAllProjects, getProjectById, getProjectsByPromotionId, updateProject } from "../services/projectService";
import { AxiosResponse } from "axios";
import { CreateProject, Project } from "../types/project";
import { getPromotionById } from "../services/promotionService";
import multer from "multer";
import { GoogleDriveService } from "../services/GoogleDriveService";
import { extractKeyFromS3Url, getSignedPdfUrl, uploadPDFToR2 } from "../services/cloudfareService";
import { URL } from 'url';
import { createGroup, getGroupById, getGroupByIdWitoutEnriching, JoinToGroup } from "../services/groupService";
import { group } from "console";


const router = Router();
const storage = multer.memoryStorage(); 
const upload = multer({ storage });
const googleDriveService = new GoogleDriveService();

// Get all projects
router.get("/", async (req, res) => {
    try{
        const response = await getAllProjects(); 
        res.status(200).json(response);
    }catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Failed to fetch projects" });
    }
});

// Get project by ID
router.get("/:id", async (req, res) => {
    const projectId =parseInt(req.params.id);
    try {
        const result = await getProjectById(projectId);

        if (!result) {
            res.status(404).json({ message: "Project not found" });
            return;
        }

        res.status(200).json(result);
    } catch (error) {
        throw error;
        //res.status(500).json({ message: "Failed to fetch project" });
        //return;
    }
});

router.get('/url', async (req, res) => {
  const { fileUrl } = req.query;

  console.log('Received fileUrl:', fileUrl);
  if (!fileUrl || typeof fileUrl !== 'string') {
    return res.status(400).json({ message: 'Paramètre fileUrl manquant ou invalide.' });
  }

  try {
    const key = extractKeyFromS3Url(fileUrl);
    console.log('Extracted key from fileUrl:', key);
    //const url = new URL(fileUrl);
    //const key = decodeURIComponent(url.pathname.replace(/^\/+/, '')); 

    const signedUrl = await getSignedPdfUrl(key);

    console.log('Generated signed URL:', signedUrl);
    // Redirige automatiquement vers le lien sécurisé
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(key)}"`);
    return res.redirect(signedUrl);
  } catch (error) {
    console.error('Erreur lors de la génération de l’URL signée :', error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});




router.get("/promotion/:id", async (req, res) => {
    const promotionId = parseInt(req.params.id);
    console.log("Fetching projects for promotion ID:", promotionId);

    try {
        const response = await getProjectsByPromotionId(promotionId);
        
        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching projects for promotion:", error);
        res.status(500).json({ message: "Failed to fetch projects for promotion" });
        return;
    }
});


//Create a new project
router.post("/", upload.single("file") ,async (req, res) => {
    
    try {
        const projectData = JSON.parse(req.body.project);
        const file = req.file;

        if (!projectData) {
            res.status(400).json({ message: "Invalid project data" });
            return;
        }

        const promotionId = projectData.promotionId;
        if (!promotionId) {
            res.status(400).json({ message: "Promotion ID is required" });
            return;
        }

        // Check if the promotion ID is valid
        const promotion = await getPromotionById(promotionId);
        if (!promotion) {
            res.status(404).json({ message: "Promotion not found" });
            return;
        }

        let fileUrl: string | undefined = undefined;

        if (file) {
            fileUrl = await uploadPDFToR2(file);
            projectData.url = fileUrl;
        }

        const project = await createProject(projectData);
        if (project.status !== 201) {
            res.status(400).json({ message: "Failed to create project" });
            return;
        }

        const projectCreated = project.data as any;
        const { maxStudents, minStudents, mode } = projectCreated;
        const projectId = projectCreated.id;
        const students = promotion.Students || [];
        const totalStudents = students.length;



        // Mélanger les étudiants
        const shuffled = students.sort(() => Math.random() - 0.5);
        const shuffledStudents = [...students].sort(() => Math.random() - 0.5);

       // Calculer le nombre de groupes
        const numberOfGroups = Math.ceil(totalStudents / maxStudents);

        const createdGroups: { id: number, name: string }[] = [];


        for (let i = 0; i < numberOfGroups; i++) {
            const groupName = `Groupe ${i + 1}`;
            const groupRes = await createGroup( groupName, projectId );
            if (groupRes.status !== 201) {
                res.status(400).json({ message: "Failed to create group" });
                return;
            }
            const groupData = groupRes.data as any;
            const groupId = groupData.id;
            createdGroups.push({ id: groupId, name: groupName });
        }

        const availableGroups = [...createdGroups];

        // Si le mode est "random", on affecte les étudiants
        if (mode === "random") {
            for (let i = 0; i < shuffledStudents.length; i++) {
                if (availableGroups.length === 0) break;

                const groupIndex = i % availableGroups.length;
                const student = shuffledStudents[i];
                const groupId = availableGroups[groupIndex].id;

                const groupe = await getGroupByIdWitoutEnriching(groupId);
                if (groupe.status !== 200) continue;

                const groupeData = groupe.data as any;

                if (groupeData.groupStudent.length >= maxStudents) {
                    availableGroups.splice(groupIndex, 1);
                    i--; // Revenir en arrière pour réessayer avec un autre groupe
                    continue;
                }

                await JoinToGroup(groupId, student.id);
            }
        }

        res.status(201).json(projectCreated);
    } catch (error) {
        res.status(500).json({ message: "Failed to create project" });
        return;
    }
});

// Update a project
router.put("/:id", async (req, res) => {
    const projectId = parseInt(req.params.id);
    const projectData = req.body;
    console.log("projectData", projectData);
    try {
        const response = await getProjectById(projectId);
        if (!response) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        console.log("response");
        console.log("avant le update");
        const updatedProject = await updateProject(projectId, projectData);
        console.log("status", updatedProject.status);
        if (updatedProject.status !== 200) {
            res.status(400).json({ message: "Failed to update project" });
            return;
        }
        res.status(200).json(updatedProject.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to update project" });
        return;
    }
});

// Delete a project
router.delete("/:id", async (req, res) => {
    const projectId = parseInt(req.params.id);
    try {
        const response = await getProjectById(projectId);
        if (response.status !== 200) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        const deletedProject = await deleteProject(projectId);
        if (deletedProject.status !== 200) {
            res.status(400).json({ message: "Failed to delete project" });
            return;
        }
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {  
        res.status(500).json({ message: "Failed to delete project" });
        return;
    }
});

// add soutenance information to a project
router.post("/soutenance/:id", async (req, res) => {
    const projectId = parseInt(req.params.id);
    console.log("Adding soutenance information for project ID:", projectId);
    const { soutenanceDate, soutenanceDuration, lieuSoutenance } = req.body;
    try {
        const response = await getProjectById(projectId);
        if (!response) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        const updatedProject = await updateProject(projectId, {
            soutenanceDate,
            soutenanceDuration,
            lieuSoutenance
        });
        if (updatedProject.status !== 200) {
            res.status(400).json({ message: "Failed to add soutenance information" });
            return;
        }
        res.status(200).json(updatedProject.data);
    } catch (error) {
        console.error("Error adding soutenance information:", error);
        res.status(500).json({ message: "Failed to add soutenance information" });
        return;
    }
});
// update soutenance information of a project
router.put("/soutenance/:id", async (req, res) => {
    const projectId = parseInt(req.params.id);
    const { soutenanceDate, soutenanceDuration, lieuSoutenance } = req.body;
    try {
        const response = await getProjectById(projectId);
        if (!response) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        const updatedProject = await updateProject(projectId, {
            soutenanceDate,
            soutenanceDuration,
            lieuSoutenance
        });
        if (updatedProject.status !== 200) {
            res.status(400).json({ message: "Failed to update soutenance information" });
            return;
        }
        res.status(200).json(updatedProject.data);
    } catch (error) {
        console.error("Error updating soutenance information:", error);
        res.status(500).json({ message: "Failed to update soutenance information" });
        return;
    }
});

export default router;