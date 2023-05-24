import express from "express";
const router = express.Router();
import * as controller from "./user.controller.js"

router.get('/index',controller.indexGet);
router.post('/index',controller.indexPost);

router.get('/myinfo/modify',controller.modifyGet);
router.post('/myinfo/modify',controller.modifyPost);

router.get('/myinfo/withdrawl',controller.withdrawlGet);
router.post('/myinfo/withdrawl',controller.withdrawlPost);

router.get('/mylocker/mylocker',controller.mylockerGet);
router.post('/mylocker/mylocker',controller.mylockerPost);

router.get('/mylocker/favorites',controller.favoritesGet);
router.post('/mylocker/favorites',controller.favoritesPost);

export default router;