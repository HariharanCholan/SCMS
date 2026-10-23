// backend/routes/authRoutes.js
import express from 'express';
import {
  register,
  login,
  getSession,
  logout,
  getUsers,
  findUser,
  createUser,
  updateUser,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/session', getSession);
router.get('/me', getSession);
router.post('/logout', logout);

// mongoService user endpoints
router.get('/', getUsers);
router.get('/users', getUsers);
router.post('/find', findUser);
router.post('/users/find', findUser);
router.post('/create', createUser);
router.post('/users/create', createUser);
router.put('/update/:id', updateUser);
router.put('/users/update/:id', updateUser);

export default router;
