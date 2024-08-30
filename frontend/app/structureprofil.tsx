"use client";


import TextInput from "./components/textInputuser";
import { FormEvent, ChangeEvent, useState } from "react";


export default function StructureProfilForm() {
    const [step, setStep] = useState(1);
    const [structureData, setStructureData] = useState({
        name: '',
        codeape: '',
        statut: '',
        date: ''
    });
    const [decompteData, setDecompteData] = useState({
        joursAnnuels: '365',
        joursWeekend: '104',
        joursCongésPayés: '25',
        joursFériés: '10'
    });
    const [decompteMensuel, setDecompteMensuel] = useState({
        janvier: '', fevrier: '', mars: '', avril: '', mai: '', juin: '',
        juillet: '', aout: '', septembre: '', octobre: '', novembre: '', decembre: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (step === 1) {
            setStructureData(prev => ({ ...prev, [name]: value }));
        } else if (step === 2) {
            setDecompteData(prev => ({ ...prev, [name]: value }));
        } else if (step === 3) {
            setDecompteMensuel(prev => ({ ...prev, [name]: value }));
        }
    };

    
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 3) {
        setStep(step + 1);
    } else {
        setIsLoading(true);
        try {
            const dataToSend = {
                ...structureData,
                ...Object.fromEntries(Object.entries(decompteData).map(([key, value]) => [key, parseInt(value) || 0])),
                decompteMensuel: Object.fromEntries(Object.entries(decompteMensuel).map(([key, value]) => [key, parseInt(value) || 0]))
            };

            const response = await fetch('http://localhost:8080/structure', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(dataToSend),
            });

            setIsLoading(false);

            if (response.ok) {
                alert('Structure créée avec succès!');
            } else {
                const errorData = await response.json();
                alert(`Erreur: ${errorData.message || 'Erreur lors de la création de la structure'}`);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la création de la structure');
            setIsLoading(false);
        }
    }
};

    const handlePrevious = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const renderForm = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <TextInput
                            id="name"
                            name="name"
                            value={structureData.name}
                            placeholder="Entrez le nom de votre entreprise"
                            onChange={handleInputChange}
                            required
                        />
                        <TextInput
                            id="codeape"
                            name="codeape"
                            value={structureData.codeape}
                            placeholder="Entrez le code APE"
                            onChange={handleInputChange}
                            required
                        />
                        <TextInput
                            id="statut"
                            name="statut"
                            value={structureData.statut}
                            placeholder="Choisissez un statut"
                            onChange={handleInputChange}
                            required
                        />
                        <TextInput
                            id="date"
                            name="date"
                            type="date"
                            value={structureData.date}
                            placeholder="Entrez la date potentielle d'ouverture"
                            onChange={handleInputChange}
                            required
                        />
                    </>
                );
            case 2:
                return (
                    <>
                        {Object.entries(decompteData).map(([key, value]) => (
                            <TextInput
                                key={key}
                                id={key}
                                name={key}
                                type="number"
                                value={value}
                                placeholder={`Entrez le nombre de ${key}`}
                                onChange={handleInputChange}
                                required
                            />
                        ))}
                    </>
                );
            case 3:
                return (
                    <>
                        {Object.entries(decompteMensuel).map(([month, value]) => (
                            <TextInput
                                key={month}
                                id={month}
                                name={month}
                                type="number"
                                value={value}
                                placeholder={`Jours travaillés en ${month}`}
                                onChange={handleInputChange}
                                required
                            />
                        ))}
                    </>
                );
        }
    };

    const renderInfo = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <h2 className="text-gray-800 text-4xl bg-gradient-to-r from-black to-blue-400 bg-clip-text text-transparent font-semibold mb-2">
                            1 - Base de votre entreprise
                        </h2>
                        <p className="text-gray-900 text-center mb-4 text-xl">
                            Le nom de votre entreprise est la première chose que vos clients verront. Choisissez un nom qui reflète votre activité et vos valeurs. Le code APE (Activité Principale Exercée) est attribué par l'INSEE et permet de catégoriser votre activité principale. Le statut juridique de votre entreprise déterminera vos obligations légales et fiscales. Enfin, la date d'ouverture potentielle vous aidera à planifier vos démarches et votre lancement.
                        </p>
                    </>
                );
            case 2:
                return (
                    <>
                        <h2 className="text-gray-800 text-4xl bg-gradient-to-r from-blue-400 to-black bg-clip-text text-transparent font-semibold mb-2">
                            2 - Décompte des jours de travail
                        </h2>
                        <p className="text-gray-900 text-center mb-4 text-xl">
                            Le décompte est indispensable pour nos calculs. Cela permet de retirer les jours sans rendement. Généralement, on compte 
                            <span className="text-gray-900 font-semibold"> 365</span> jours annuels, <span className="text-gray-900 font-semibold"> 104</span> jours week-end, <span className="text-gray-900 font-semibold"> 25</span> jours de congés payés et <span className="text-gray-900 font-semibold"> 10</span> jours fériés.
                        </p>
                    </>
                );
            case 3:
                return (
                    <>
                        <h2 className="text-gray-800 text-4xl bg-gradient-to-r from-black to-blue-400 bg-clip-text text-transparent font-semibold mb-2">
                            3 - Répartition mensuelle des jours
                        </h2>
                        <p className="text-gray-900 text-center mb-4 text-xl">
                            Indiquez le nombre de jours travaillés pour chaque mois. Cette répartition nous permettra d'affiner nos calculs et de prendre en compte les variations saisonnières de votre activité.
                        </p>
                    </>
                );
        }
    };

    return (
        <div className="flex h-full bg-gray-100">
            <div className="w-1/2 border-t-2 border-l-2 border-blue-800 bg-white p-8 flex flex-col justify-center items-center">
                <div className="w-full max-w-sm">
                    <h2 className="text-center text-4xl bg-gradient-to-r from-black to-blue-400 bg-clip-text text-transparent font-semibold mb-2">
                        Structure
                    </h2>
                    <h2 className="text-center text-4xl bg-gradient-to-r from-blue-400 to-black bg-clip-text text-transparent font-semibold mb-6">
                        De votre entreprise
                    </h2>
                    <form onSubmit={handleSubmit}>
                        {renderForm()}
                        <div className="flex justify-between mt-4">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                                >
                                    Précédent
                                </button>
                            )}
                            <button
                                type="submit"
                                className={`bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLoading}
                            >
                                {step === 3 ? "Soumettre" : "Suivant"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="border-b-2 border-r-2 border-blue-600 w-1/2 bg-slate-100 p-8 flex flex-col justify-center items-center">
                {renderInfo()}
                <button className="px-4 py-2 text-xl text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                    En savoir plus
                </button>
            </div>
        </div>
    );
}