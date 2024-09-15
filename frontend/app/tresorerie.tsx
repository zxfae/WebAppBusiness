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

interface TresoType {
  id: number;
  name: string;
  inputText: JSX.Element | string;
  status: "Encaissement" | "Rentrée nulle" | "Not Started";
  avatar: string;
  actions?: JSX.Element;
}

const statusColorMap: Record<TresoType["status"], "success" | "danger" | "warning"> = {
  "Encaissement": "success",
  "Rentrée nulle": "danger",
  "Not Started": "danger",
};

const messagesByStep = {
  1: {
    title: "Prévisionnel de Trésorerie - Rémunérations",
    content: (
      <div>
        <p>
        Cette section liste les <span className="text-red-600 font-semibold">rémunérations </span>deboursées chaque mois de l’entreprise.
        <br />
        Ce plan de trésorerie <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent font-semibold">enregistre chaque flux</span>, au fur et à mesure <br />
        <br />
        Le plan prévisionnel de trésorerie <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent font-semibold">est une anticipation</span> de ces mouvements mensuels 
        et <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent font-semibold">fait partie des plans</span> à réaliser en <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent font-semibold">phase de création d’entreprise</span>
        <br /><br /><span className="text-red-600 text-base">*Merci de renseigner le montant annuel</span> 
        </p>
      </div>
    ),
  },
  2: {
    title: "Prévisionnel de Trésorerie - Frais Variables",
    content: (
      <div>
        <p>
        Cette section liste <span className="text-red-600 font-semibold">les frais variables </span> deboursées chaque mois de l’entreprise.
        <br />
        Ce plan de trésorerie <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent font-semibold">enregistre chaque flux</span>, au fur et à mesure <br />
        <br />
        Le plan prévisionnel de trésorerie <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent font-semibold">est une anticipation</span> de ces mouvements mensuels 
        et <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent font-semibold">fait partie des plans</span> à réaliser en <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent font-semibold">phase de création d’entreprise</span>
        <br /><br /><span className="text-red-600 text-base">*Merci de renseigner le montant annuel</span> 
        </p>
      </div>
    ),
  },
  3: {
    title: "Prévisionnel de Trésorerie - Frais Fixes",
    content: (
      <div>
        <p>
        Cette section liste <span className="text-red-600 font-semibold">les frais fixes </span> deboursées chaque mois de l’entreprise.
        <br />
        Ce plan de trésorerie <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent font-semibold">enregistre chaque flux</span>, au fur et à mesure <br />
        <br />
        Le plan prévisionnel de trésorerie <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent font-semibold">est une anticipation</span> de ces mouvements mensuels 
        et <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent font-semibold">fait partie des plans</span> à réaliser en <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent font-semibold">phase de création d’entreprise</span>
        <br /><br /><span className="text-red-600 text-base">*Merci de renseigner le montant annuel</span> 
        </p>
      </div>
    ),
  },
};

const ProductionTableForm: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [tresoData, setTresoData] = useState({
    sbs: '',
    cotpat: '',
    schef: ''
  });

  const [tresoCeData, setTresoCe] = useState({
    fournitures: '',
    carburant: '',
    entretiens: '',
    fraisgen: '',
    edf: '',
    deplacement: ''
  });

  const [tresoFfData, setTresoFf] = useState({
    prestaext: '',
    assurc: '',
    assuraut: '',
    loyerlocaux: '',
    empruntsbanc: '',
    publicit: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to ${value}`);

    if (step === 1) {
      setTresoData(prev => ({ ...prev, [name]: value }));
    } else if (step === 2) {
      setTresoCe(prev => ({ ...prev, [name]: value }));
    } else if (step === 3){
      setTresoFf(prev =>({...prev, [name]: value}));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1 as 1 | 2 | 3);
    } else {
      const intData = {
        SalaireBrut: parseInt(tresoData.sbs, 10),
        CotPat: parseInt(tresoData.cotpat, 10),
        Schef: parseInt(tresoData.schef, 10),
        TresoCE: {
          Fournitures: parseInt(tresoCeData.fournitures, 10),
          Carburant: parseInt(tresoCeData.carburant, 10),
          Entretiens: parseInt(tresoCeData.entretiens, 10),
          FraisGen: parseInt(tresoCeData.fraisgen, 10),
          Edf: parseInt(tresoCeData.edf, 10),
          Deplacement: parseInt(tresoCeData.deplacement, 10),
        },
        TresoFF: {
          Prestaext: parseInt(tresoFfData.prestaext, 10),
          Assurc: parseInt(tresoFfData.assurc, 10),
          Assuraut: parseInt(tresoFfData.assuraut, 10),
          LL: parseInt(tresoFfData.loyerlocaux, 10),
          Bank: parseInt(tresoFfData.empruntsbanc, 10),
          Pub: parseInt(tresoFfData.publicit, 10),
        }
      };

      setIsLoading(true);

      try {
        const response = await fetch('http://localhost:8080/treso', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(intData),
        });
        setIsLoading(false);

        if (response.ok) {
          alert('Treso créée avec succès!');
        } else {
          const errorData = await response.json();
          alert(`Erreur: ${errorData.message || 'Erreur lors de la création de la Treso'}`);
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la création de la Treso');
        setIsLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1 as 1 | 2 | 3);
    }
  };

  const treso: TresoType[] = [
    {
      id: 1,
      name: "Salaire Brut Salariés",
      inputText: (
        <input
          type="number"
          id="sbs"
          name="sbs"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={tresoData.sbs}
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
      name: "Cotisation Patronales",
      inputText: (
        <input
          type="number"
          id="cotpat"
          name="cotpat"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={tresoData.cotpat}
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
      name: "Prelevement du chef",
      inputText: (
        <input
          type="number"
          id="schef"
          name="schef"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={tresoData.schef}
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

  const tresoCe: TresoType[] = [
    {
      id: 1,
      name: "Fournitures",
      inputText: (
        <input
          type="number"
          id="fournitures"
          name="fournitures"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={tresoCeData.fournitures}
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
      name: "Carburant",
      inputText: (
        <input
          type="number"
          id="carburant"
          name="carburant"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={tresoCeData.carburant}
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
      name: "Entretiens",
      inputText: (
        <input
          type="number"
          id="entretiens"
          name="entretiens"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={tresoCeData.entretiens}
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
      name: "Frais genereux",
      inputText: (
        <input
          type="number"
          id="fraisgen"
          name="fraisgen"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={tresoCeData.fraisgen}
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
      name: "edf",
      inputText: (
        <input
          type="number"
          id="edf"
          name="edf"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={tresoCeData.edf}
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
      name: "Deplacement(hotellerie...)",
      inputText: (
        <input
          type="number"
          id="deplacement"
          name="deplacement"
          min="0"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={tresoCeData.deplacement}
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
    const tresoFF: TresoType[] = [
      {
        id: 1,
        name: "Prestaext",
        inputText: (
          <input
            type="number"
            id="prestaext"
            name="prestaext"
            min="0"
            className="border border-gray-300 rounded px-2 py-1 w-full"
            value={tresoFfData.prestaext}
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
        name: "Assurc",
        inputText: (
          <input
            type="number"
            id="assurc"
            name="assurc"
            min="0"
            className="border border-gray-300 rounded px-2 py-1 w-full"
            value={tresoFfData.assurc}
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
        name: "Assuraut",
        inputText: (
          <input
            type="number"
            id="assuraut"
            name="assuraut"
            min="0"
            className="border border-gray-300 rounded px-2 py-1 w-full"
            value={tresoFfData.assuraut}
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
        name: "Loyer Locaux",
        inputText: (
          <input
            type="number"
            id="loyerlocaux"
            name="loyerlocaux"
            min="0"
            className="border border-gray-300 rounded px-2 py-1 w-full"
            value={tresoFfData.loyerlocaux}
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
        name: "Emprunts Bancaires",
        inputText: (
          <input
            type="number"
            id="empruntsbanc"
            name="empruntsbanc"
            min="0"
            className="border border-gray-300 rounded px-2 py-1 w-full"
            value={tresoFfData.empruntsbanc}
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
        id: 6,
        name: "Publicité",
        inputText: (
          <input
            type="number"
            id="publicit"
            name="publicit"
            min="0"
            className="border border-gray-300 rounded px-2 py-1 w-full"
            value={tresoFfData.publicit}
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
      }
    ];    

    const dataToDisplay = step === 3 ? tresoFF : (step === 1 ? treso : tresoCe);

  return (
    <div className="container mx-auto p-4">
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
                  parseInt(tresoData.sbs, 10) || 0,
                  parseInt(tresoData.cotpat, 10) || 0,
                  parseInt(tresoData.schef, 10) || 0,
                ]}
              />
            )}
          </div>  
          </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Table aria-label="Example table with custom cells" className="min-w-full">
          <TableHeader>
            <TableColumn>Répartition Temps de Travail et d'Activité</TableColumn>
            <TableColumn>MONTANT ANNUEL</TableColumn>
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

        <div className="flex justify-between mt-4">
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
            {step < 3 ? "Suivant" : "Soumettre"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductionTableForm;
