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
import FixtureController from '../controllers/fixture.controller';

import { auth, adminAuth } from '../middlewares/middlewares';

const userService = new UserService();
const adminService = new AdminService();
const loginService = new LoginService();
const teamService = new TeamService();
const searchService = new SearchService();

const searchController = new SearchController(searchService);
const userController = new UserController(userService);
const adminController = new AdminController(adminService);
const loginController = new LoginController(loginService);
const teamController = new TeamController(teamService);
const fixtureController = new FixtureController(FixtureService);

const router = Router();

// User routes
router.post('/users', (req, res) => userController.createUser(req, res));

// Admin routes
router.post('/admin', (req, res) => adminController.createAdmin(req, res));

// Authentication routes
router.post('/login', (req, res) => loginController.login(req, res));

// Teams
router.post('/teams', adminAuth, (req, res) => teamController.createTeam(req, res));
router.put('/teams', adminAuth, (req, res) => teamController.updateTeam(req, res));
router.delete('/teams', adminAuth, (req, res) => teamController.deleteTeam(req, res));
router.get('/teams/:id', auth, (req, res) => teamController.getTeam(req, res));
router.get('/teams', auth, (req, res) => teamController.getTeams(req, res));

// Fixtures
router.post('/fixture', adminAuth, (req, res) => fixtureController.createFixture(req, res));
router.put('/fixture', adminAuth, (req, res) => fixtureController.updateFixture(req, res));
router.delete('/fixture', adminAuth, (req, res) => fixtureController.deleteFixture(req, res));
router.get('/fixture/:id', auth, (req, res) => fixtureController.getFixture(req, res));
router.get('/fixture', auth, (req, res) => fixtureController.getFixtures(req, res));

// Search
router.get('/search/team', (req, res) => searchController.searchTeam(req, res));
router.get('/search/fixture', (req, res) => searchController.searchFixture(req, res));

export default router;
