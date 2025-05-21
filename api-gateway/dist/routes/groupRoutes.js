"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const groupService_1 = require("../services/groupService");
const projectService_1 = require("../services/projectService");
const promotionService_1 = require("../services/promotionService");
const shuffle_1 = require("../utils/shuffle");
const router = (0, express_1.Router)();
// Get all groups
router.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Simulate fetching groups from a service
        const groups = yield (0, groupService_1.getAllGroups)(); // Replace with actual service call
        res.status(200).json(groups);
    }
    catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: 'Failed to fetch groups' });
    }
}));
// Get group by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = parseInt(req.params.id);
    console.log("Group ID:", groupId);
    try {
        const group = yield (0, groupService_1.getGroupById)(groupId); // Replace with actual service call
        if (group.status !== 200) {
            res.status(404).json({ message: 'Group not found' });
            return;
        }
        const groupData = group.data; // Adjust based on your response structure
        console.log("Group Data:", groupData);
        res.status(200).json(groupData);
    }
    catch (error) {
        console.error('Error fetching group:', error);
        res.status(500).json({ message: 'Failed to fetch group' });
    }
}));
// Create Group manually
router.post('/:projectId/manual', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupData = req.body;
        const ProjectId = parseInt(req.params.projectId);
        if (!groupData) {
            res.status(400).json({ message: 'Invalid group data' });
            return;
        }
        // Get the project ID from the request parameters
        const project = yield (0, projectService_1.getProjectById)(ProjectId);
        // Simulate creating a group
        const newGroup = yield (0, groupService_1.createGroup)(groupData, ProjectId); // Replace with actual service call
        res.status(201).json(newGroup);
    }
    catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Failed to create group' });
    }
}));
// Create Group randomly
router.post('/:projectId/random', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Creating random group");
        const ProjectId = parseInt(req.params.projectId);
        console.log("Project ID:", ProjectId);
        // Get the project ID from the request parameters
        const projectResponse = yield (0, projectService_1.getProjectById)(ProjectId);
        if (projectResponse.status !== 200) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        const project = projectResponse.data;
        console.log("Project Data:", project);
        if (project.mode !== 'random') {
            res.status(400).json({ message: 'Project is not in random mode' });
            return;
        }
        const promotionResponse = yield (0, promotionService_1.getPromotionById)(project.promotionId);
        if (promotionResponse.status !== 200) {
            res.status(404).json({ message: 'Promotion not found' });
            return;
        }
        const promotion = promotionResponse.data;
        console.log("Promotion Data:", promotion);
        const studentsInPromotion = promotion.promotionStudents.map((ps) => ps.studentId);
        console.log("Students in Promotion:", studentsInPromotion);
        const minStudents = project.minStudents;
        const maxStudents = project.maxStudents;
        if (studentsInPromotion.length === 0) {
            res.status(400).json({ message: 'No students found in promotion' });
            return;
        }
        // Mélange aléatoire des étudiants
        const shuffledStudents = (0, shuffle_1.shuffleArray)(studentsInPromotion);
        const createdGroups = [];
        const failedStudents = [];
        while (shuffledStudents.length > 0) {
            // Choix aléatoire entre min et max étudiants
            const groupSize = Math.min(maxStudents, Math.max(minStudents, Math.floor(Math.random() * (maxStudents - minStudents + 1)) + minStudents));
            const studentsForGroup = shuffledStudents.splice(0, groupSize);
            const groupPayload = {
                name: `Groupe ${createdGroups.length + 1}`,
                projectId: ProjectId,
            };
            const students = studentsForGroup;
            console.log("Group Payload:", groupPayload);
            console.log("Students for Group:", students);
            const newGroup = yield (0, groupService_1.createGroup)(groupPayload.name, ProjectId);
            if (newGroup.status !== 201) {
                res.status(400).json({ message: 'Failed to create group' });
                return;
            }
            const groupData = newGroup.data; // Adjust based on your response structure
            console.log("Group Data:", groupData);
            // add students to the group
            for (const studentId of students) {
                const addStudentResponse = yield (0, groupService_1.addStudentToGroup)(groupData.id, studentId);
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
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create group' });
    }
}));
// Create Group freely
router.post('/:projectId/free', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupData = req.body;
        const ProjectId = parseInt(req.params.projectId);
        if (!groupData) {
            res.status(400).json({ message: 'Invalid group data' });
            return;
        }
        // Get the project ID from the request parameters
        const project = yield (0, projectService_1.getProjectById)(ProjectId);
        // Simulate creating a group
        const newGroup = yield (0, groupService_1.createGroup)(groupData, ProjectId); // Replace with actual service call
        res.status(201).json(newGroup);
    }
    catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Failed to create group' });
    }
}));
// Add student to group
router.post('/addStudent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupId, studentId } = req.body;
        if (!groupId || !studentId) {
            res.status(400).json({ message: 'Invalid group ID or student ID' });
            return;
        }
        // Simulate adding a student to a group
        const updatedGroup = yield (0, groupService_1.addStudentToGroup)(groupId, studentId); // Replace with actual service call
        res.status(200).json(updatedGroup);
    }
    catch (error) {
        console.error('Error adding student to group:', error);
        res.status(500).json({ message: 'Failed to add student to group' });
    }
}));
exports.default = router;
