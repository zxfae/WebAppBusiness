import React from 'react';

const BannerUser: React.FC = () => {
    return (
        <header>
            <div className="relative  overflow-hidden border-2 border-indigo-300 border-x-indigo-500 rounded-lg shadow-xl w-full">
                <div className="overflow-hidden absolute inset-0 bg-gradient-to-r from-white to-white opacity-75 z-10" />
                    <div className="relative z-20 flex flex-col justify-center h-full px-8">
                        <h1 className="text-gray-800 text-4xl font-bold mb-2">
                            Profil Utilisateur
                        </h1>
                        <p className="text-xl text-gray-800 opacity-90">
                         Bienvenue sur votre espace personnel
                        </p>
                    </div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-tl-full" />
            </div>
            </header>
    );
};

export default BannerUser;