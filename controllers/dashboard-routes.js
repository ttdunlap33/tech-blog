const router = require('express').Router()
const sequelize = require('../config/connection')
const { Post, User, Comment } = require('../models')
const withAuth = require('../utils/auth')

router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            // use ID from session
            user_id: req.session.user_id,
        },
        attributes: ['id', 'title', 'created_at', 'post_content'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username'],
                },
            },
            {
                model: User,
                attributes: ['username'],
            },
        ],
    }).then((postData) => {
            // serialize data before passing over to template
            const posts = postData.map((post) => post.get({ plain: true }))
            res.render('dashboard', { posts, loggedIn: true, username: req.session.username })
        }).catch((err) => {
            console.log(err)
            res.status(500).json(err)
        })
})

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id,
        },
        attributes: ['id', 'title', 'created_at', 'post_content'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username'],
                },
            },
            {
                model: User,
                attributes: ['username'],
            },
        ],
    }).then((postData) => {
            if (!postData) {
                res.status(404).json({ message: 'No post found with this id' })
                return
            }

            // serialize data
            const post = postData.get({ plain: true })

            res.render('edit-post', {
                post,
                loggedIn: true,
                username: req.session.username
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json(err)
        })
})

router.get('/create/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            // use ID from session
            user_id: req.session.user_id,
        },
        attributes: ['id', 'title', 'created_at', 'post_content'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username'],
                },
            },
            {
                model: User,
                attributes: ['username'],
            },
        ],
    }).then((postData) => {
            // serialize data before passing over to template
            const posts = postData.map((post) => post.get({ plain: true }))
            res.render('create-post', { posts, loggedIn: true, username: req.session.username })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json(err)
        })
})

module.exports = router
