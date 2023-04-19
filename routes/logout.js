import express from 'express';

const router = express.Router();

router.get(
  "/",
    async(req, res)=>{
      if(req.session.user){
        req.session.destroy(() => {
          req.session;
        });
        console.log(req.session);
        res.redirect('/');
      }
    }
)

export default router;