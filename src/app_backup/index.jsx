import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';
import '../assets/css/style.css';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

const initialData = window.__INITIAL_DATA__;

// Hydrate the server-rendered HTML
hydrateRoot(
    document.getElementById('root'),
    <HelmetProvider>
        <BrowserRouter>
            <App initialData={initialData} />
        </BrowserRouter>
    </HelmetProvider>
);
