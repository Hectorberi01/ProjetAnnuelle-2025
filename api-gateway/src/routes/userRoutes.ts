import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getStudents, getUserByEmail, getUserById } from '../services/userService';
const router = Router();

router.get('/', async (req, res) => {
    try {
        const response = await getAllUsers()
        if (!response || response.length === 0) {
           res.status(404).json({ message: 'No users found' });
           return;
        }
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Error in user service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// create user
router.post('/', async (req, res) => {
    const userData = req.body;
    try {
        const response = await getUserByEmail(userData.email);
        if (response) {
            res.status(400).json({ message: 'User with this email already exists' });
            return;
        }
        const createdUser = await createUser(userData);
        if (!createdUser) {
            res.status(500).json({ message: 'Failed to create user' });
            return;
        }
        res.status(201).json(createdUser);
    } catch (error) {
        console.error('Error in user service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// get students
router.get('/students', async (req, res) => {
    try {
        const response = await getStudents();
        if (!response || response.length === 0) {
            res.status(404).json({ message: 'No students found' });
            return;
        }
        res.status(200).json(response);
    } catch (error) {
        console.error('Error in user service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/:id', async (req, res) => {
    const userId = Number(req.params.id);
    try {
        const response = await getUserById(userId);
        if (!response) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(response);
    } catch (error) {
        console.error('Error in user service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// user by email
router.get('/email/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const response = await getUserByEmail(email);
        if (!response) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(response);
    } catch (error) {
        console.error('Error in user service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}); 


//delete user
router.delete('/:id', async (req, res) => {
    const userId = Number(req.params.id);
    try {
        const response = await getUserById(userId);
        if (!response) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const deleteResponse = await deleteUser(userId);
        if (!deleteResponse) {
            res.status(500).json({ message: 'Failed to delete user' });
            return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error in user service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
