"use client";

import { useState } from 'react';
import UserProfileForm from '../app/userprofil';
import StructureProfilForm from './structureprofil';
import DashBoard from './dashboard';
import ProductionTableForm from './production';

export default function Home() {
    //OK state
    const [activeSection, setActiveSection] = useState('connexion');
    //AuthentificationStatut
    const [isAuth, setIsAuth] = useState(false);

    const handleLoginSuccess = () => {
        setIsAuth(true);
        setActiveSection('dashboard');
    };

    const renderContent = () => {
        if (!isAuth && activeSection !== 'connexion') {
            return <UserProfileForm onLoginSuccess={handleLoginSuccess} />;
        }

        switch (activeSection) {
            case 'dashboard':
                return <DashBoard />;
            case 'basic':
                return <StructureProfilForm />;
            case 'connexion':
                return <UserProfileForm onLoginSuccess={handleLoginSuccess} />;
            case 'financement':
                return <h1 className="text-gray-800 text-2xl font-bold">Bilan De Financement</h1>;
            case 'tresorerie':
                return <h1 className="text-gray-800 text-2xl font-bold">Plan Trésorerie</h1>;
            case 'amortissement':
                return <h1 className="text-gray-800 text-2xl font-bold">Amortissement Linéaire</h1>;
            case 'production':
                return <ProductionTableForm />;
            default:
                return <UserProfileForm onLoginSuccess={handleLoginSuccess} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="flex-1 flex">
                <aside className="w-64 bg-white shadow-lg p-4">
                    <h2 className="bg-gradient-to-r from-blue-800 to-black bg-clip-text text-transparent text-2xl font-bold mb-6">WebApp Finance</h2>
                    <ul>
                        <li>
                            <button
                                onClick={() => {
                                    if (isAuth) setActiveSection('connexion');
                                }}
                                aria-pressed={activeSection === 'profile'}
                                className={`block py-2 px-4 rounded-lg text-left w-full ${
                                    activeSection === 'connexion'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Connexion
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    if (isAuth) setActiveSection('dashboard');
                                }}
                                aria-pressed={activeSection === 'dashboard'}
                                className={`block py-2 px-4 rounded-lg text-left w-full ${
                                    activeSection === 'dashboard'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Mon Tableau de Bord
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    if (isAuth) setActiveSection('basic');
                                }}
                                aria-pressed={activeSection === 'basic'}
                                className={`block py-2 px-4 rounded-lg text-left w-full ${
                                    activeSection === 'basic'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Structure de l'entreprise
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    if (isAuth) setActiveSection('production');
                                }}
                                aria-pressed={activeSection === 'production'}
                                className={`block py-2 px-4 rounded-lg text-left w-full ${
                                    activeSection === 'production'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Production
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    if (isAuth) setActiveSection('financement');
                                }}
                                aria-pressed={activeSection === 'financement'}
                                className={`block py-2 px-4 rounded-lg text-left w-full ${
                                    activeSection === 'financement'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Plan de Financement
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    if (isAuth) setActiveSection('tresorerie');
                                }}
                                aria-pressed={activeSection === 'tresorerie'}
                                className={`block py-2 px-4 rounded-lg text-left w-full ${
                                    activeSection === 'tresorerie'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Plan Trésorerie
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    if (isAuth) setActiveSection('amortissement');
                                }}
                                aria-pressed={activeSection === 'amortissement'}
                                className={`block py-2 px-4 rounded-lg text-left w-full ${
                                    activeSection === 'amortissement'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Amortissement Linéaire
                            </button>
                        </li>
                    </ul>
                </aside>

                <main className="flex-1 p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}