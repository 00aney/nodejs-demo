const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../models');

const router = express.Router();

router.get('/', (req, res) => {
});
router.post('/', async (req, res, next) => {
  try {
    const exUser = await db.User.findOne({
      where: {
        userId: req.body.userId
      }
    });
    if (exUser) {
      return res.status(403).send('The id already exists.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // salt 10 ~ 13
    const newUser = await db.User.create({
      nickname: req.body.nickname,
      userId: req.body.userId,
      password: hashedPassword,
    });
    console.log(newUser);
    return res.status(200).json(newUser);
  } catch(e) {
    console.error(e);
    // return res.status(403).send(e);
    return next(e);
  }
});
router.get('/:id', (req, res) => {
});
router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('logout success');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if(err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).json(info);
      // return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      try {
        if (loginErr) {
          return next(loginErr);
        }
        const fullUser = await db.User.findOne({
          where: { id: user.id },
          include: [{
            model: db.Post,
            as: 'Posts',
            attributes: ['id'],
          }, {
            model: db.User,
            as: 'Followings',
            attributes: ['id'],
          }, {
            model: db.User,
            as: 'Followers',
            attributes: ['id'],
          }],
          attributes: ['id', 'nickname', 'userId'],
        });
        return res.json(fullUser);
      } catch(e) {
        next(e);
      }
    });
  })(req, res, next);
});
router.get('/:id/follow', (req, res) => {
});
router.post('/:id/follow', (req, res) => {
});
router.delete('/:id/follow', (req, res) => {
});
router.delete('/:id/follower', (req, res) => {
});
router.get('/:id/posts', (req, res) => {
});

module.exports = router;
