require('@babel/register')({
    extensions: ['.js', '.jsx'],
    presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]]
});
require('dotenv').config();
const express = require('express');
const React = require('react');
const { renderToString } = require('react-dom/server');
const { StaticRouter } = require('react-router-dom/server');
const { matchPath } = require('react-router-dom');
const { HelmetProvider } = require('react-helmet-async');
const path = require('path');
const fs = require('fs');

const App = require('../app/App').default;
const routes = require('../app/routes').default; // Note: using require for SSR compatibility
const { generateHTML } = require('./template');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '../../public')));

// Serve CSS
app.get('/style.css', (req, res) => {
    const cssPath = path.join(__dirname, '../assets/css/style.css');
    if (fs.existsSync(cssPath)) {
        res.setHeader('Content-Type', 'text/css');
        res.sendFile(cssPath);
    } else {
        res.status(404).send('CSS not found');
    }
});

// SSR for all routes
app.get('*', async (req, res) => {
    const helmetContext = {};
    let initialData = null;

    // 1. Match Route and Fetch Data
    const activeRoute = routes.find(route => matchPath(route.path, req.path));

    if (activeRoute && activeRoute.fetchData) {
        try {
            const match = matchPath(activeRoute.path, req.path);
            console.log(`Fetching data for route: ${req.path}`);
            initialData = await activeRoute.fetchData(match.params);
        } catch (error) {
            console.error('Error fetching SSR data:', error);
            // Don't crash, just render with null data (client will retry or show error)
        }
    }

    // 2. Render App with Data
    const appHTML = renderToString(
        React.createElement(
            HelmetProvider,
            { context: helmetContext },
            React.createElement(
                StaticRouter,
                { location: req.url },
                React.createElement(App, { initialData })
            )
        )
    );

    const { helmet } = helmetContext;

    // 3. Generate HTML with Initial Data
    const html = generateHTML(appHTML, initialData, helmet);

    res.send(html);
});

app.listen(PORT, () => {
    console.log(`🚀 Frontend SSR server running on http://localhost:${PORT}`);
});
