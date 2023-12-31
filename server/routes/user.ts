import { Request, Response } from 'express';

import express from 'express';
const router = express.Router();

import { userController } from '../controllers/userController';

router.post(
  '/',
  userController.authenticateUser,
  (req: Request, res: Response) => {
    
    res.cookie('firstname', res.locals.firstname)
    res.cookie('username', res.locals.username)
    res.cookie('user_id', res.locals.user_id)
    return res.status(200).json(res.locals.loginStatus);
  },
);

router.post(
  '/signup',
  userController.createUser,
  userController.authenticateUser,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.loginStatus);
  },
);

module.exports = router;
