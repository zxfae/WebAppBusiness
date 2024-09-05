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
import { DeleteIcon } from "./components/DeleteIcon";
import { EyeIcon } from "./components/EyeIcon";
import { EditIcon } from "./components/EditIcon";
import ChartsProd from "./components/prodcharts";

interface ProductionType {
  id: number;
  name: string;
  inputText: JSX.Element | string;
  status: "Encaissement" | "Rentrée nulle" | "Not Started";
  avatar: string;
  actions?: JSX.Element;
}

const statusColorMap: Record<ProductionType["status"], "success" | "danger" | "warning"> = {
  "Encaissement": "success",
  "Rentrée nulle": "danger",
  "Not Started": "danger",
};

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

const FinancementForm: React.FC = () => {
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

  const production: ProductionType[] = [
    {
      id: 1,
      name: "Production",
      inputText: (
        <input
          type="number"
          id="production"
          name="production"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionData.production}
          onChange={handleChange}
          required
        />
      ),
      status: "Encaissement",
      avatar: "https://www.svgrepo.com/show/535118/accessibility.svg",
      actions: (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Details">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EyeIcon />
            </span>
          </Tooltip>
          <Tooltip content="Edit user">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete user">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DeleteIcon />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      id: 2,
      name: "Gestion Clientèle - Facture - Devis",
      inputText: (
        <input
          type="number"
          id="gestionclient"
          name="gestionclient"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionData.gestionclient}
          onChange={handleChange}
          required
        />
      ),
      status: "Rentrée nulle",
      avatar: "https://www.svgrepo.com/show/381030/finance-business-money-payment-inflation.svg",
      actions: (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Details">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EyeIcon />
            </span>
          </Tooltip>
          <Tooltip content="Edit user">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete user">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DeleteIcon />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      id: 3,
      name: "Interprofession",
      inputText: (
        <input
          type="number"
          id="interprofession"
          name="interprofession"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionData.interprofession}
          onChange={handleChange}
          required
        />
      ),
      status: "Rentrée nulle",
      avatar: "https://www.svgrepo.com/show/381030/finance-business-money-payment-inflation.svg",
      actions: (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Details">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EyeIcon />
            </span>
          </Tooltip>
          <Tooltip content="Edit user">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete user">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DeleteIcon />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      id: 4,
      name: "formation",
      inputText: (
        <input
          type="number"
          id="formation"
          name="formation"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionData.formation}
          onChange={handleChange}
          required
        />
      ),
      status: "Rentrée nulle",
      avatar: "https://www.svgrepo.com/show/381030/finance-business-money-payment-inflation.svg",
      actions: (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Details">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EyeIcon />
            </span>
          </Tooltip>
          <Tooltip content="Edit user">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete user">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DeleteIcon />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      id: 5,
      name: "entretien",
      inputText: (
        <input
          type="number"
          id="entretien"
          name="entretien"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionData.entretien}
          onChange={handleChange}
          required
        />
      ),
      status: "Rentrée nulle",
      avatar: "https://www.svgrepo.com/show/381030/finance-business-money-payment-inflation.svg",
      actions: (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Details">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EyeIcon />
            </span>
          </Tooltip>
          <Tooltip content="Edit user">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete user">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DeleteIcon />
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  const productionDetails: ProductionType[] = [
    {
      id: 1,
      name: "Production / Service par jours",
      inputText: (
        <input
          type="number"
          id="productionjours"
          name="productionjours"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionDetailData.productionjours}
          onChange={handleChange}
          required
        />
      ),
      status: "Rentrée nulle",
      avatar: "https://www.svgrepo.com/show/535118/accessibility.svg",
      actions: (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Details">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EyeIcon />
            </span>
          </Tooltip>
          <Tooltip content="Edit user">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete user">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DeleteIcon />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      id: 2,
      name: "Production / Service par an",
      inputText: (
        <input
          type="number"
          id="productionann"
          name="productionann"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionDetailData.productionann}
          onChange={handleChange}
          required
        />
      ),
      status: "Rentrée nulle",
      avatar: "https://www.svgrepo.com/show/381030/finance-business-money-payment-inflation.svg",
      actions: (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Details">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EyeIcon />
            </span>
          </Tooltip>
          <Tooltip content="Edit user">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete user">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DeleteIcon />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      id: 3,
      name: "TVA",
      inputText: (
        <input
          type="number"
          id="tva"
          name="tva"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionDetailData.tva}
          onChange={handleChange}
          required
        />
      ),
      status: "Rentrée nulle",
      avatar: "https://www.svgrepo.com/show/381030/finance-business-money-payment-inflation.svg",
      actions: (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Details">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EyeIcon />
            </span>
          </Tooltip>
          <Tooltip content="Edit user">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete user">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DeleteIcon />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      id: 4,
      name: "Moyenne prix service",
      inputText: (
        <input
          type="number"
          id="prixserv"
          name="prixserv"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionDetailData.prixserv}
          onChange={handleChange}
          required
        />
      ),
      status: "Not Started",
      avatar: "https://www.svgrepo.com/show/381030/finance-business-money-payment-inflation.svg",
      actions: (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Details">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EyeIcon />
            </span>
          </Tooltip>
          <Tooltip content="Edit user">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete user">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DeleteIcon />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      id: 6,
      name: "Chiffre d'affaire annuel",
      inputText: (
        <input
          type="number"
          id="caann"
          name="caann"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionDetailData.caann}
          onChange={handleChange}
          required
        />
      ),
      status: "Not Started",
      avatar: "https://www.svgrepo.com/show/381030/finance-business-money-payment-inflation.svg",
      actions: (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Details">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EyeIcon />
            </span>
          </Tooltip>
          <Tooltip content="Edit user">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete user">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DeleteIcon />
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      id: 5,
      name: "Chiffre d'affaire journalier",
      inputText: (
        <input
          type="number"
          id="cajours"
          name="cajours"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={productionDetailData.cajours}
          onChange={handleChange}
          required
        />
      ),
      status: "Not Started",
      avatar: "https://www.svgrepo.com/show/381030/finance-business-money-payment-inflation.svg",
      actions: (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Details">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EyeIcon />
            </span>
          </Tooltip>
          <Tooltip content="Edit user">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete user">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DeleteIcon />
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  const dataToDisplay = step === 1 ? production : productionDetails;

  return (
    <div className="container mx-auto p-4">

      <form onSubmit={handleSubmit}>
        <Table aria-label="Example table with custom cells" className="min-w-full">
          <TableHeader>
            <TableColumn>Répartition Temps de Travail et d'Activité</TableColumn>
            <TableColumn>Nombres jours</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {dataToDisplay.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <User avatarProps={{ src: item.avatar }} name={item.name} description={item.name} />
                </TableCell>
                <TableCell>{item.inputText}</TableCell>
                <TableCell>
                  <Chip color={statusColorMap[item.status]}>{item.status}</Chip>
                </TableCell>
                <TableCell>{item.actions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mb-3 flex justify-between mt-2">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Précédent
            </button>
          )}
          <button
            type="submit"
            className={`${
              isLoading ? "bg-gray-400" : "bg-blue-500"
            } text-white px-4 py-2 rounded`}
            disabled={isLoading}
          >
            {step < 2 ? "Suivant" : "Soumettre"}
          </button>
        </div>
      </form>
      <div className="mb-8 flex space-x-4">
        <div className="bg-slate-100 flex-1 p-4 border border-gray-300 rounded-lg shadow-md">
          <h2 className="mt-6 mb-10 text-black text-4xl bg-gradient-to-r from-blue-800 to-blue-950 bg-clip-text text-transparent font-semibold mb-4 text-center">
          <p>{messagesByStep[step].title}</p>
          </h2>
          <p className="text-black text-center mb-2 text-xl font-medium">
          <p>{messagesByStep[step].content}</p>
          </p>
        </div>
        <div className="justify-content-center bg-white flex-1 p-4 border border-gray-300 rounded-lg shadow-md flex items-center justify-center">
          <div style={{ width: '340px', height: '340px' }} className="justify-content-center bg-white flex-1 p-4 border border-gray-300 rounded-lg shadow-md flex items-center justify-center">
            {step === 1 && (
              <ChartsProd
                data={[
                  parseInt(productionData.production, 10) || 0,
                  parseInt(productionData.gestionclient, 10) || 0,
                  parseInt(productionData.interprofession, 10) || 0,
                  parseInt(productionData.formation, 10) || 0,
                  parseInt(productionData.entretien, 10) || 0
                ]}
              />
            )}
          </div>  
          </div>
      </div>
    </div>
  );
};

export default FinancementForm;
