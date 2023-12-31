import { NextFunction, Request, RequestHandler, Response } from 'express';
const bcrypt = require('bcrypt');
const db = require('../models/jobModels');

type userController = {
  createUser: RequestHandler;
  authenticateUser: RequestHandler;
};


/**
 * SIGNUP: 
 * 1. send POST request to http://localhost:3000/api/login/signup
 * 2. if response == true, it means new data is stored in database AND user is authenticated
 *    if response == false, it means username already exists in DB
 * 
 * LOGIN
 * 1. send POST request to http://localhost:3000/api/login/
 * 2. if response == true, user is authenticated. 
 *    if response == false, either user does not exist or password is incorrect
 */

export const userController: userController = {
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, firstname} = req.body;

    const querySelectStr: string = `
      SELECT * 
      FROM users
      WHERE users.username = '${username}'`;
    const query = await db.query(querySelectStr);

    if (query.rows.length > 0) {
      res.locals.loginStatus = false;
      return next()
    }

    const hash = bcrypt.hashSync(password, 10);
    const queryInsertStr = `
      INSERT INTO users(username, password, firstname)
      VALUES ('${username}', '${hash}', '${firstname}')`;

    await db.query(queryInsertStr);

    res.locals.loginStatus = true;

    return next();
  },

  authenticateUser: async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    // do query to see if username exists. if user does not exist, return false
    const queryStr = `
      SELECT * FROM users
      WHERE users.username = '${username}'`;
    const query = await db.query(queryStr);

    if (query.rows.length === 0) {
      res.locals.loginStatus = false;
      return next()
    }

    const hash = query.rows[0].password;
    const firstname = query.rows[0].firstname;
    res.locals.firstname = firstname;
    res.locals.username = username;
    res.locals.loginStatus = bcrypt.compareSync(password, hash);
    res.locals.user_id = query.rows[0].id;

    return next();
  },
};
