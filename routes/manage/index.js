import express from "express";
import * as controller from "./manage.controller.js"
const router = express.Router();

router.get('/',controller.indexGet);
router.post('/',controller.indexPost);

router.get('/locker',controller.lockerGet);
router.post('/locker',controller.lockerPost);


export default router;