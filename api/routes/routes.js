import { Router } from 'express';

import UserService from '../services/user.service';
import LoginService from '../services/login.service';
import AdminService from '../services/admin.service';
import TeamService from '../services/team.service';
import FixtureService from '../services/fixture.service';
import SearchService from '../services/search.service';

import UserController from '../controllers/user.controller';
import LoginController from '../controllers/login.controller';
import AdminController from '../controllers/admin.controller';
import TeamController from '../controllers/team.controller';
import SearchController from '../controllers/search.controller';

import { auth, adminAuth } from '../middlewares/middlewares';

const userService = new UserService;
