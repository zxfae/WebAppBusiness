"use client";

import { useState } from 'react';
import TextInput from './components/textInputuser';
import MyImg from './components/myimg';

interface UserProfileFormProps {
    onLoginSuccess: () => void;
}

export default function UserProfileForm({ onLoginSuccess }: UserProfileFormProps) {
    const [userData, setUserData] = useState({
        lastname: '',
        firstname: '',
        email: '',
        password: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrorMessage('');
    };

    const resetForm = () => {
        setUserData({
            lastname: '',
            firstname: '',
            email: '',
            password: ''
        });
        setErrorMessage(''); 
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
    
        const url = isLogin ? 'http://localhost:8080/login' : 'http://localhost:8080/users';
    
        const payload = isLogin
            ? { email: userData.email, password: userData.password }
            : { ...userData };
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            setIsLoading(false);
            if (response.ok) {
                resetForm();
                setIsLoading(false)
                onLoginSuccess();
            } else {
                const errorData = await response.json();
                console.error('Erreur de serveur:', errorData);
                setErrorMessage(errorData.message || 'Erreur lors de la connexion ou de la création de l\'utilisateur');
            }
        } catch (error) {
            console.error('Erreur:', error);
            setErrorMessage('Erreur lors de la connexion ou de la création de l\'utilisateur');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full bg-gray-100">
            <div className="w-1/2 border-t-2 border-l-2 border-blue-800 bg-white p-8 flex flex-col justify-center items-center">
                <div className="w-full max-w-sm">
                    <h2 className="text-center text-4xl bg-gradient-to-r from-black to-blue-400 bg-clip-text text-transparent font-semibold mb-6">
                        Bienvenue
                    </h2>
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <>
                                <TextInput
                                    id="lastname"
                                    name="lastname"
                                    value={userData.lastname}
                                    placeholder="Entrez votre Nom"
                                    onChange={handleInputChange}
                                    required
                                />
                                <TextInput
                                    id="firstname"
                                    name="firstname"
                                    value={userData.firstname}
                                    placeholder="Entrez votre Prénom"
                                    onChange={handleInputChange}
                                    required
                                />
                            </>
                        )}
                        <TextInput
                            id="email"
                            name="email"
                            type="email"
                            value={userData.email}
                            placeholder="Entrez votre adresse email"
                            onChange={handleInputChange}
                            required
                        />
                        <TextInput
                            id="password"
                            name="password"
                            type="password"
                            value={userData.password}
                            placeholder="Entrez votre mot de passe"
                            onChange={handleInputChange}
                            required
                        />
                        <button
                            type="submit"
                            className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer un compte')}
                        </button>
                        {errorMessage && (
                            <p className="mt-2 text-red-500 text-center">{errorMessage}</p>
                        )}
                    </form>
                    <p className="mt-4 text-center text-gray-600">
                        {isLogin ? (
                            <>
                                Vous n'avez pas de compte ?{' '}
                                <button
                                    className="text-blue-600 hover:underline"
                                    onClick={() => setIsLogin(false)}
                                >
                                    Créer un compte
                                </button>
                            </>
                        ) : (
                            <>
                                Vous avez déjà un compte ?{' '}
                                <button
                                    className="text-blue-600 hover:underline"
                                    onClick={() => setIsLogin(true)}
                                >
                                    Se connecter
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
            <div className="border-b-2 border-r-2 border-blue-600 w-1/2 bg-slate-100 p-8 flex flex-col justify-center items-center">
                <h2 className="text-gray-800 text-4xl bg-gradient-to-r from-black to-blue-400 bg-clip-text text-transparent font-semibold mb-6">
                    WebAppFinance
                </h2>
                <MyImg />
                <p className="text-gray-600 text-center mb-4 text-xl">
                    Nous défendons l'idée que chacun peut créer son business plan facilement et gratuitement.
                </p>
                <p className="text-gray-600 text-center mb-4 text-xl">
                    WebAppFinance vous accompagne dans la génération de votre plan de financement, bilan prévisionnel et bilan de trésorerie. Présentez votre dossier de financement aux banques en toute confiance !
                </p>
                <button className="px-4 py-2 text-xl text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                    Je simule mon projet
                </button>
            </div>
        </div>
    );
}