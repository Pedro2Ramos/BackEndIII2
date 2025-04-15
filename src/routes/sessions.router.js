import { Router } from 'express';
import sessionsController from '../controllers/sessions.controller.js';

const router = Router();

router.post('/register',sessionsController.register);
router.post('/login',sessionsController.login);
router.post('/logout', (req, res) => {
    res.clearCookie('coderCookie').send({ status: "success", message: "Logged out" });
});
router.get('/current',sessionsController.current);
router.post('/unprotectedLogin',sessionsController.unprotectedLogin);
router.get('/unprotectedCurrent',sessionsController.unprotectedCurrent);

export default router;