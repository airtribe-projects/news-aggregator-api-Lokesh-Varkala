require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const { router: authRouter } = require('./routes/auth');
const preferencesRouter = require('./routes/preferences');
const newsRouter = require('./routes/news');

app.use('/api/auth', authRouter);
app.use('/api/preferences', preferencesRouter);
app.use('/api/news', newsRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = app;
