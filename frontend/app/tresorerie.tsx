import React, { FormEvent, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from "@nextui-org/react";

import ChartsTreso from "./components/tresorerieCharts";

interface TresoType {
  id: number;
  name: string;
  inputText: JSX.Element | string;
  actions?: JSX.Element;
}

const messagesByStep = {
  1: {
    title: "Production",
    content: (
      <div>
        Cette section <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent font-semibold">mesure la régularité des flux de trésorerie et d'identifier les périodes à optimiser</span>,
        la répartition du temps de travail <span className="bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent font-semibold">analyse les performances financières </span> en comptabilisant les jours avec et sans encaissement.
        <br />
        <span className="bg-gradient-to-r from-red-500 to-red-500  bg-clip-text text-transparent">Sur votre droite, un graphique se met a jour automatiquement des votre saisie</span>
      </div>
    ),
  },
  2: {
    title: "Détails de la Production",
    content: (
      <div>
        À cette étape, veuillez fournir les détails concernant les jours de production ainsi que les objectifs annuels
        pour analyser la productivité de votre entreprise.
      </div>
    ),
  },
  3: {
    title: "Détails Financiers",
    content: (
      <div>
        Merci de renseigner les données financières telles que la TVA, le prix des services,
        ainsi que les chiffres d'affaires journaliers et annuels pour compléter l'analyse financière.
      </div>
    ),
  },
};

const PTSForm: React.FC = () => {
  const [step, setStep] = useState<1 | 2 >(1);
  const [productionData, setProductionData] = useState({
    production: '',
    gestionclient: '',
    interprofession: '',
    formation: '',
    entretien: ''
  });

  const [productionDetailData, setProductionDataDetails] = useState({
    productionjours: '',
    productionann: '',
    tva: '',
    prixserv: '',
    cajours: '',
    caann: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (step === 1) {
      setProductionData(prev => ({ ...prev, [name]: value }));
    } else if (step === 2) {
      setProductionDataDetails(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1 as 1 | 2);
    } else {
      const intData = {
        Production: parseInt(productionData.production, 10),
        GestionClient: parseInt(productionData.gestionclient, 10),
        Interprofession: parseInt(productionData.interprofession, 10),
        Formation: parseInt(productionData.formation, 10),
        Entretien: parseInt(productionData.entretien, 10),
        ProductionDetail: {
          Productionjours: parseInt(productionDetailData.productionjours, 10),
          Productionann: parseInt(productionDetailData.productionann, 10),
        },
        ProductionFinanceDetail: {
          Tva: parseInt(productionDetailData.tva, 10),
          Prixserv: parseInt(productionDetailData.prixserv, 10),
          Cajours: parseInt(productionDetailData.cajours, 10),
          Caann: parseInt(productionDetailData.caann, 10),
        }
      };

      setIsLoading(true);

      try {
        const response = await fetch('http://localhost:8080/production', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(intData),
        });
        setIsLoading(false);

        if (response.ok) {
          alert('Production créée avec succès!');
        } else {
          const errorData = await response.json();
          alert(`Erreur: ${errorData.message || 'Erreur lors de la création de la Production'}`);
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la création de la production');
        setIsLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1 as 1 | 2);
    }
  };

  const treso: TresoType[] = [
    {
      id: 1,
      name: "Assurance RC && RCP",
      inputText: (
        <input
          type="number"
          id="assurc"
          name="assurc"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionData.production}
          onChange={handleChange}
          required
        />
      ),
    },
    {
      id: 2,
      name: "Frais d’études et prestataires externes",
      inputText: (
        <input
          type="number"
          id="prestaext"
          name="prestaext"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionData.gestionclient}
          onChange={handleChange}
          required
        />
      ),

    },
    {
        id: 3,
        name: "Assurance autres",
        inputText: (
          <input
            type="number"
            id="assuraut"
            name="assuaut"
            min="0"
            className="border border-gray-300 rounded px-2 py-1 w-full"
            value={productionData.production}
            onChange={handleChange}
            required
          />
        ),
      },
      {
        id: 4,
        name: "Loyer - Locaux",
        inputText: (
          <input
            type="number"
            id="loyerlocaux"
            name="loyerlocaux"
            min="0"
            className="border border-gray-300 rounded px-2 py-1 w-full"
            value={productionData.interprofession}
            onChange={handleChange}
            required
          />
        ),
      },
      {
        id: 5,
        name: "Emprunts Bancaires",
        inputText: (
          <input
            type="number"
            id="empruntsbanc"
            name="empruntsbanc"
            min="0"
            className="border border-gray-300 rounded px-2 py-1 w-full"
            value={productionData.gestionclient}
            onChange={handleChange}
            required
          />
        ),
      },
      {
        id: 6,
        name: "Publicité",
        inputText: (
          <input
            type="number"
            id="publicit"
            name="publicit"
            min="0"
            className="border border-gray-300 rounded px-2 py-1 w-full"
            value={productionData.interprofession}
            onChange={handleChange}
            required
          />
        ),
      },
  ];
  const tresoRemu: TresoType[] = [
    {
      id: 1,
      name: "Salaire Brut salariés",
      inputText: (
        <input
          type="number"
          id="sbs"
          name="sbs"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionData.production}
          onChange={handleChange}
          required
        />
      ),
    },
    {
      id: 2,
      name: "Cot. Pat. sur Salaire",
      inputText: (
        <input
          type="number"
          id="cotpat"
          name="cotpat"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionData.gestionclient}
          onChange={handleChange}
          required
        />
      ),

    },
    {
        id: 3,
        name: "Prélèvements Chef",
        inputText: (
          <input
            type="number"
            id="schef"
            name="schef"
            min="0"
            className="border border-gray-300 rounded px-2 py-1 w-full"
            value={productionData.production}
            onChange={handleChange}
            required
          />
        ),
      },
  ];

  const tresoDetails: TresoType[] = [
    {
      id: 1,
      name: "Fournitures (en tout genre)",
      inputText: (
        <input
          type="number"
          id="fournitures"
          name="fournitures"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionDetailData.productionjours}
          onChange={handleChange}
          required
        />
      ),
    },
    {
      id: 2,
      name: "Carburant",
      inputText: (
        <input
          type="number"
          id="carburant"
          name="carburant"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionDetailData.productionann}
          onChange={handleChange}
          required
        />
      ),
    },
    {
      id: 3,
      name: "Entretiens - Réparations",
      inputText: (
        <input
          type="number"
          id="entretiens"
          name="entretiens"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionDetailData.tva}
          onChange={handleChange}
          required
        />
      ),
    },
    {
      id: 4,
      name: "Frais Généraux",
      inputText: (
        <input
          type="number"
          id="fraisgen"
          name="fraisgen"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionDetailData.prixserv}
          onChange={handleChange}
          required
        />
      ),
    },
    {
      id: 5,
      name: "EDF - Eau",
      inputText: (
        <input
          type="number"
          id="edf"
          name="edf"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionDetailData.caann}
          onChange={handleChange}
          required
        />
      ),
    },
    {
      id: 6,
      name: "Déplacements",
      inputText: (
        <input
          type="number"
          id="deplacement"
          name="deplacement"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionDetailData.cajours}
          onChange={handleChange}
          required
        />
      ),
    },
  ];

  const dataToDisplay = step === 1 ? treso : tresoDetails;

  return (
    <div className="container mx-auto p-4">
        <div className="p-4 shadow-md mb-8 flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
            <div className="flex-1 flex items-center justify-center">
                <form onSubmit={handleSubmit} className="mt-2 w-full max-w-2xl">
                    <Table aria-label="FF" className="mb-4">
                        <TableHeader>
                            <TableColumn className="text-black font-medium">FRAIS FIXES</TableColumn>
                            <TableColumn className="text-black font-medium">Total Année</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {dataToDisplay.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="text-black">{item.name}</TableCell>
                                <TableCell>{item.inputText}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </form>
            </div>
        <div className="flex-1 flex items-center justify-center bg-white p-4 border border-gray-300 rounded-lg shadow-md">
          <div className="w-full max-w-2xl">
                <ChartsTreso />
            </div>
        </div>
        </div>

        <div className="p-4 shadow-md mb-8 flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
        <div className="flex-1 flex items-center justify-center">
                <form onSubmit={handleSubmit} className="mt-2 w-full max-w-2xl">
                    <Table aria-label="FF" className="mb-4">
                        <TableHeader>
                            <TableColumn className="text-black font-medium">FRAIS FIXES</TableColumn>
                            <TableColumn className="text-black font-medium">Total Année</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {tresoRemu.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="text-black">{item.name}</TableCell>
                                <TableCell>{item.inputText}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </form>
            </div>
            <div className="flex-1 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="mt-2 w-full max-w-2xl">
            <Table aria-label="Example table with custom cells" className="mb-4">
                <TableHeader>
                <TableColumn className="text-black font-medium">Charges d'Éxploitations</TableColumn>
                <TableColumn className="text-black font-medium">Total Année</TableColumn>
                </TableHeader>
                <TableBody>
                {tresoDetails.map((item) => (
                    <TableRow key={item.id}>
                    <TableCell className="text-black">{item.name}</TableCell>
                    <TableCell>{item.inputText}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
                </form>
            </div>
        </div>
        <div className="flex justify-between mt-4">
                {step > 1 && (
                <button
                    type="button"
                    onClick={handlePrevious}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Précédent
                </button>
                )}
                <button
                type="submit"
                className={`${
                    isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                } text-white px-4 py-2 rounded`}
                disabled={isLoading}
                >
                {step < 2 ? "Suivant" : "Soumettre"}
                </button>
            </div>
    </div>
  );
};

export default PTSForm;


/**
 * 
 * <div className="bg-slate-100 flex-1 p-4 border border-gray-300 rounded-lg shadow-md">
          <h2 className="mt-6 mb-10 text-black text-4xl bg-gradient-to-r from-blue-800 to-blue-950 bg-clip-text text-transparent font-semibold mb-4 text-center">
          <p>{messagesByStep[step].title}</p>
          </h2>
          <p className="text-black text-center mb-2 text-xl font-medium">
          <p>{messagesByStep[step].content}</p>
          </p>
        </div>
        
 */