const express = require('express')
const routes = require('./controllers')
const sequelize = require('./config/connection')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const path = require('path')
const helpers = require('./utils/helpers')
const exphbars = require('express-handlebars')
const hbars = exphbars.create({ helpers })
const session = require('express-session')
const app = express()
const PORT = process.env.PORT || 3001

const sess = {
    secret: 'frenchfry',
    cookie: {
        // Session will expire in 10 minutes
        expires: 10 * 60 * 1000,
    },
    resave: true,
    rolling: true,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
    }),
};

app.use(session(sess))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.engine('handlebars', hbars.engine)
app.set('view engine', 'handlebars')
app.use(routes)

// start connection
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'))
});
