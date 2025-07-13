import { Router } from 'express';
import { JoinToGroup, createGroup, getAllGroups, getGroupById, getGroupByProjectId } from '../services/groupService';
import { getProjectById } from '../services/projectService';
import { getPromotionById } from '../services/promotionService';
import { shuffleArray } from '../utils/shuffle';


const router = Router();

// Get all groups
router.get('/', async (req, res) => {
    try {
        // Simulate fetching groups from a service
        const groups = await getAllGroups(); // Replace with actual service call
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: 'Failed to fetch groups' });
    }
})

// Get group by ID
router.get('/:id', async (req, res) => {
    const groupId = parseInt(req.params.id);
    console.log("Group ID:", groupId);
    try {
        const group = await getGroupById(groupId); // Replace with actual service call
        if (group.status !== 200) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }
        const groupData = (group as any).data; // Adjust based on your response structure
        console.log("Group Data:", groupData);
       
        res.status(200).json(groupData);
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(500).json({ message: 'Failed to fetch group' });
    }
})

router.get('/project/:projectId', async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    console.log("Fetching groups for project ID:", projectId);
    try {
        const groups = await getGroupByProjectId(projectId); // Replace with actual service call to fetch groups by project ID
        
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching groups for project:', error);
        res.status(500).json({ message: 'Failed to fetch groups for project' });
    }
});

// // Create Group manually
// router.post('/:projectId/manual', async (req, res) => {
//     try {
//         const groupData = req.body;
//         const ProjectId = parseInt(req.params.projectId);
//         if (!groupData) {
//             res.status(400).json({ message: 'Invalid group data' });
//             return;
//         }
//         // Get the project ID from the request parameters
//         const project =  await getProjectById(ProjectId);
//         // Simulate creating a group
//         const newGroup = await createGroup(groupData,ProjectId); // Replace with actual service call
//         res.status(201).json(newGroup);
//     } catch (error) {
//         console.error('Error creating group:', error);
//         res.status(500).json({ message: 'Failed to create group' });
//     }
// })

// Create Group randomly
router.post('/:projectId/create', async (req, res) => {
    try {
        console.log("Creating random group");

        const ProjectId = parseInt(req.params.projectId);


        // Get the project ID from the request parameters
        const projectResponse =  await getProjectById(ProjectId);
        if(projectResponse.status !== 200) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        const project = (projectResponse as any).data;
        if(project.mode !== 'random') {
            res.status(400).json({ message: 'Project is not in random mode' });
            return;
        }

        const promotionResponse = await getPromotionById(project.promotionId);
        if (promotionResponse.status !== 200) {
            res.status(404).json({ message: 'Promotion not found' });
            return;
        }
        const promotion = (promotionResponse as any).data;

        const studentsInPromotion = promotion.promotionStudents.map((ps: any) => ps.studentId);

        const minStudents = project.minStudents;
        
        const maxStudents = project.maxStudents;

        if (studentsInPromotion.length === 0) {
            res.status(400).json({ message: 'No students found in promotion' });
            return;
        }

        // Mélange aléatoire des étudiants
        const shuffledStudents = shuffleArray(studentsInPromotion);

        const createdGroups = [];
        const failedStudents: number[] = [];
        
        while (shuffledStudents.length > 0) {
            // Choix aléatoire entre min et max étudiants
            const groupSize = Math.min(maxStudents, Math.max(minStudents, Math.floor(Math.random() * (maxStudents - minStudents + 1)) + minStudents));
            const studentsForGroup : number[] = shuffledStudents.splice(0, groupSize) as number[];

            const groupPayload = {
                name: `Groupe ${createdGroups.length + 1}`,
                projectId: ProjectId,
            };
            const students = studentsForGroup;

            console.log("Group Payload:", groupPayload);
            console.log("Students for Group:", students);

            const newGroup = await createGroup(groupPayload.name, ProjectId);
            if (newGroup.status !== 201) {
                res.status(400).json({ message: 'Failed to create group' });
                return;
            }
            const groupData = (newGroup as any).data; // Adjust based on your response structure
            console.log("Group Data:", groupData);
            // add students to the group
            
            for (const studentId of students) {
                const addStudentResponse = await JoinToGroup(groupData.id, studentId);
                if (addStudentResponse.status !== 201) {
                    console.warn(`Failed to add student ${studentId} to group ${groupData.id}`);
                    failedStudents.push(studentId);
                }
            }
            createdGroups.push(groupData);
        }
        console.log("Fin de la création des groupes");

        res.status(201).json({
            message: 'Groups created successfully',
            createdGroups,
            failedStudents: failedStudents.length > 0 ? failedStudents : undefined
        })

    } catch (error) {
        res.status(500).json({ message: 'Failed to create group' });
    }
});

// // Create Group freely
// router.post('/:projectId/free', async (req, res) => {
//     try {
//         const groupData = req.body;
//         const ProjectId = parseInt(req.params.projectId);
//         if (!groupData) {
//             res.status(400).json({ message: 'Invalid group data' });
//             return;
//         }
//         // Get the project ID from the request parameters
//         const project =  await getProjectById(ProjectId);
//         // Simulate creating a group
//         const newGroup = await createGroup(groupData,ProjectId); // Replace with actual service call
//         res.status(201).json(newGroup);
//     } catch (error) {
//         console.error('Error creating group:', error);
//         res.status(500).json({ message: 'Failed to create group' });
//     }
// });

// Add student to group
router.post('/join-to-group', async (req, res) => {
    try {
        const { groupId, studentId } = req.body;
        if (!groupId || !studentId) {
            res.status(400).json({ message: 'Invalid group ID or student ID' });
            return;
        }
        // Simulate adding a student to a group
        const updatedGroup = await JoinToGroup(groupId, studentId); 
        
        const data = await updatedGroup.data; // Adjust based on your response structure
        res.status(200).json(data);
    } catch (error) {
        console.error('Error adding student to group:', error);
        res.status(500).json({ message: 'Failed to add student to group' });
    }
});

export default router;