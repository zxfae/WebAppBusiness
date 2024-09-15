"use client";

import ChartsNmensuel from "./components/charsnmensuel";
import TextInput from "./components/textInputuser";
import { FormEvent, ChangeEvent, useState, useEffect } from "react";

export default function StructureProfilForm() {
    const [step, setStep] = useState(1);
    const [structureData, setStructureData] = useState({
        name: '',
        codeape: '',
        statut: '',
        date: ''
    });

    const [decompteData, setDecompteData] = useState({
        joursAnnuels: '',
        joursWeekend: '',
        joursCongésPayés: '',
        joursFériés: ''
    });

    const [decompteMensuel, setDecompteMensuel] = useState({
        janvier: '0', fevrier: '0', mars: '0', avril: '0', mai: '0', juin: '0',
        juillet: '0', aout: '0', septembre: '0', octobre: '0', novembre: '0', decembre: '0'
    });

    const [joursRestants, setJoursRestants] = useState(0);
    const [totalJoursRepartis, setTotalJoursRepartis] = useState(0);
    const [joursminimal,setJoursMinimal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setTotalJoursRepartis(
            Object.values(decompteMensuel).reduce((acc, val) => acc + (Number(val) || 0), 0)
        );
    }, [decompteMensuel]);

    useEffect(() => {
        const totalJoursRepartis = Object.values(decompteMensuel).reduce((acc, val) => acc + (Number(val) || 0), 0);
        setTotalJoursRepartis(totalJoursRepartis);
    
        const joursRestants = Number(decompteData.joursAnnuels) -
                              Number(decompteData.joursWeekend) -
                              Number(decompteData.joursCongésPayés) -
                              Number(decompteData.joursFériés);

        setJoursRestants(joursRestants);

        setJoursMinimal(joursRestants - totalJoursRepartis);
    }, [decompteMensuel, decompteData]);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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
            if (totalJoursRepartis !== joursRestants) {
                alert(`Le total des jours répartis (${totalJoursRepartis}) doit être égal aux jours restants (${joursRestants}).`);
                return;
            }

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
                        <h2 className="text-4xl bg-gradient-to-r from-blue-800 to-blue-950 bg-clip-text text-transparent font-semibold mb-4">
                            1 - Base de votre entreprise
                        </h2>
                        <p className="text-black text-center mb-2 text-xl font-medium">
                        <ul className="list-decimal w-3/4 mx-auto flex flex-col items-center text-xl font-semibold">
                                <li className="mb-2">
                                        <h1>Choisissez un nom qui <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent font-semibold">reflète vos valeurs</span></h1>
                                </li>
                                <li className="mb-2">
                                        <h1>Le <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent font-semibold">code APE</span><span className="text-red-600 text-medium">*</span> (Activité Principale Exercée) est attribué par l'INSEE et permet de catégoriser votre activité principale.</h1>
                                        <a href="https://entreprendre.service-public.fr/vosdroits/F33050" className="text-red-600 text-medium">*Plus d'informations</a>
                                </li>
                                <li className="mb-2">
                                        <h1>Le <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent font-semibold">statut juridique</span> de votre entreprise déterminera vos obligations légales et fiscales.</h1>
                                        <p className="text-red-600 text-medium">*(entreprise individuelle, EIRL, SARL et EURL, SAS et SASU, SA..)</p>
                                </li>
                                <li className="mb-2">
                                        <h1>La date d'ouverture potentielle vous aidera <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent font-semibold">à planifier vos démarches</span> et votre lancement.</h1>
                                </li>
                            </ul>
                        </p>
                    </>
                );
            case 2:
                return (
                    <>
                        <h2 className="text-gray-800 text-4xl bg-gradient-to-r from-blue-800 to-blue-950 bg-clip-text text-transparent font-semibold mb-4">
                            2 - Décompte des jours de travail
                        </h2>
                        <p className="text-black text-center mb-4 font-medium text-xl">
                            Le décompte est indispensable pour nos calculs. Cela permet de retirer les jours sans rendement. Généralement, on compte :
                        </p>
                        <ul className="text-black text-center mb-4 text-xl font-semiblod">
                                <li className="p-1 m-1 bg-white border-2 border-black rounded-lg">
                                    <p><span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent font-semibold"> 365</span> jours annuels</p>
                                </li>
                                <li className="m-1 p-1 bg-white border-2 rounded-lg border-black">
                                    <span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent font-semibold"> 104</span> jours week-end
                                </li>
                                <li className="m-1 p-1 bg-white border-2 rounded-lg border-black">
                                    <span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent font-semibold"> 25</span> jours de congés payés
                                </li>
                                <li className="p-1 m-1 bg-white border-2 rounded-lg border-black">
                                    <span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent font-semibold"> 10</span> jours fériés
                                </li>
                        </ul>
                        <p className="text-red-600 text-center mb-4 font-medium text-medium">
                            *Les valeurs du formulaire pré-rempli sont modifiables
                        </p>
                    </>
                );
            case 3:
                return (
                    <>
                        <h2 className="text-gray-800 text-4xl bg-gradient-to-r from-blue-800 to-blue-950 bg-clip-text text-transparent font-semibold mb-4">
                            3 - Répartition mensuelle des jours
                        </h2>
                        <ul className="list-decimal w-3/4 text-black flex flex-col items-center text-xl font-semibold">
                            <li>
                                <p className="text-xl text-black text-center">
                                Vous devez répartir <span className="text-emerald-700 text-xl font-bold">{joursRestants}</span>
                                </p>
                            </li>
                            <li>
                                <p className="text-xl text-black text-center">
                                Il vous reste : <span className={joursminimal != 0 ? 'text-red-500' : 'text-emerald-700'}>{joursminimal}</span> jours à répartir
                                </p>
                            </li>
                        </ul>
                        <p className="mt-4 text-black text-center mb-2 text-xl font-medium">
                            Indiquez le nombre de jours travaillés pour <span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent font-semibold">chaque mois</span>. Cette répartition affine nos calculs et <span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent font-semibold">prend en compte les variations saisonnières</span> de votre activité.
                        </p>
                        <ChartsNmensuel decompteMensuel={decompteMensuel} />
                    </>
                );
        }
    };

    return (
        <div className="flex h-full bg-gray-100">
            <div className="w-1/2 border-t-2 border-l-2 border-blue-800 bg-white p-8 flex flex-col justify-center items-center">
                <div className="w-full max-w-sm">
                    <h2 className="text-center text-4xl bg-gradient-to-r from-blue-800 to-blue-950 bg-clip-text text-transparent font-semibold mb-2">
                        Structure
                    </h2>
                    <h2 className="text-center text-4xl bg-gradient-to-r from-blue-950 to-blue-800 bg-clip-text text-transparent font-semibold">
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
                            className={`bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 
                                ${isLoading || (step === 3 && totalJoursRepartis !== joursRestants) ? 'opacity-60 cursor-not-allowed' : ''}`}
                            disabled={isLoading || (step === 3 && totalJoursRepartis !== joursRestants)}
                        >
                            {step === 3 ? "Soumettre" : "Suivant"}
                        </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="border-b-2 border-r-2 border-blue-600 w-1/2 bg-slate-100 p-8 flex flex-col justify-center items-center">
                {renderInfo()}
                <button className="px-4 py-2 text-xl text-blue-600 border-b-2 border-t-2 border-l-1 border-r-1 border-blue-900 rounded-md hover:bg-blue-50">
                    Retour Tableau de Bord
                </button>
            </div>
        </div>
    );
}


