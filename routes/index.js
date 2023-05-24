import express from "express";
const router = express.Router();
import * as controller from "./main.controller.js"

router.get('/',controller.indexGet);
router.post('/',controller.indexPost);

router.get('/routes/add',controller.addGet);
router.post('/routes/add',controller.addPost);

router.get('/routes/locker',controller.lockerGet);
router.post('/routes/locker',controller.lockerPost);

router.get('/routes/login',controller.loginGet);
router.post('/routes/login',controller.loginPost);

router.get('/routes/logout',controller.logoutGet);

router.get('/routes/register',controller.registerGet);
router.post('/routes/register',controller.registerPost);

export default router;