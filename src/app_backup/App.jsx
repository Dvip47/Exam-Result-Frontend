import React, { createContext, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import routes from './routes';

export const DataContext = createContext(null);

export default function App({ initialData }) {
    return (
        <DataContext.Provider value={initialData}>
            <div className="app">
                <Header />
                <Navigation />
                <Routes>
                    {routes.map(({ path, component: Component }) => (
                        <Route
                            key={path}
                            path={path}
                            element={<Component />}
                        />
                    ))}
                </Routes>
                <Footer />
            </div>
        </DataContext.Provider>
    );
}
