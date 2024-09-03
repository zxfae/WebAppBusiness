import React from "react";
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
import ChartsNmensuel from "./components/piechars";

const statusColorMap: Record<string, "success" | "danger" | "warning"> = {
  Completed: "success",
  "In Progress": "warning",
  "Not Started": "danger",
};

const users = [
  {
    id: 1,
    name: "Production",
    inputText: "FORMULAIRE saisi par",
    status: "In Progress",
    avatar: "https://www.svgrepo.com/show/381030/finance-business-money-payment-inflation.svg",
  },
  {
    id: 2,
    name: "Gestion Clientèle - devis - Facture",
    inputText: "Not Started",
    status: "Not Started",
    avatar: "https://www.svgrepo.com/show/381030/finance-business-money-payment-inflation.svg",
  },
  {
    id: 3,
    name: "Interprofession",
    inputText: "In Progress",
    status: "In Progress",
    avatar: "https://www.svgrepo.com/show/381030/finance-business-money-payment-inflation.svg",
  },
  {
    id: 4,
    name: "Formation",
    inputText: "Completed",
    status: "Completed",
    avatar: "https://www.svgrepo.com/show/381030/finance-business-money-payment-inflation.svg",
  },
  {
    id: 5,
    name: "Entretien",
    inputText: "Completed",
    status: "Completed",
    avatar: "https://www.svgrepo.com/show/381030/finance-business-money-payment-inflation.svg",
  },
  
];

const columns = [
  { name: "Répartition temps de travail", uid: "name" },
  { name: "Nombres Jours", uid: "inputText" },
  { name: "Statut", uid: "status" },
  { name: "Actions", uid: "actions" },
];


export default function App() {
  const renderCell = React.useCallback(
    (user: typeof users[0], columnKey: string) => {
      const cellValue = user[columnKey as keyof typeof user];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-4xl capitalize text-default-400">
                <User description={user.name} name={cellValue as string} />
              </p>
            </div>
          );
        case "inputText":
          return (
            <p className="text-bold text-2xl capitalize text-default-400">
              {cellValue}
            </p>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[cellValue as string]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
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
          );
        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <Table aria-label="Example table with custom cells">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={users}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey as string)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex space-x-4">
        <div className="bg-slate-100 flex-1 p-4 border border-gray-300 rounded-lg shadow-md">
          <h2 className="text-black text-4xl bg-gradient-to-r from-blue-800 to-blue-950 bg-clip-text text-transparent font-semibold mb-4 text-center">Production</h2>
            <p className="text-black text-center mb-2 text-xl font-medium">
              Afin de mesurer <span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent font-semibold">la régularité des flux de trésorerie </span>
              et <span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent font-semibold">d'identifier </span> les périodes <span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent font-semibold">à optimiser, </span>
              La répartition du temps de travail <span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent font-semibold">analyse les performances financières </span>
              en comptabilisant les jours avec et sans encaissement.
            </p>
        </div>

        <div className="justify-content-center bg-white flex-1 p-4 border border-gray-300 rounded-lg shadow-md flex items-center justify-center">
          <div className="w-2/5">
            <ChartsNmensuel />
          </div>
        </div>
      </div>
    </div>
  );
}
