'use client';

import './index.css'
import CustomTable from "@/components/CustomTable/CustomTable";
import {useState} from "react";
import Button from "@mui/material/Button";
import ClientDialog from "@/components/ClientDialog/ClientDialog";
import api from "@/axios/api";

export default function ClientPage() {
  const [open, setOpen] = useState(false);
  const [reloadTable, setReloadTable] = useState(false);

  const handleCreateClient = async (clientData) => {
    await api.post('client/create', clientData)
    setReloadTable(prevState => !prevState);
  };

  const columns = [
    {
      field: "id",
      label: "ID",
      autoCol: true
    },
    {
      field: "name",
      label: "Nome",
      autoCol: true
    },
    {
      field: 'creditLimit',
      label: "Limite de crédito",
      render: (item) => {
        return Intl.NumberFormat('pt-BR',
          {
            style: 'currency',
            currency: 'BRL'
          }).format(item.creditLimit || 0)
      }
    },
    {
      field: 'spendThisMonth',
      label: "Total de gastos",
      render: (item) => {
        return Intl.NumberFormat('pt-BR',
          {
            style: 'currency',
            currency: 'BRL'
          }).format(item.spendThisMonth || 0)
      }
    },
    {
      field: 'totalSpend',
      label: 'Gastos',
      autoCol: true,
      render: (item) => {
        return `${Math.floor((item.spendThisMonth / item.creditLimit) * 100)}%`
      }
    }
  ]

  return (
    <>
      <div className="client-page-container">
        <h1>Lista de Clientes</h1>

        <div>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Novo Cliente
          </Button>
        </div>

        <CustomTable
          columns={columns}
          endpoint="/client"
          reloadTable={reloadTable}
        />
      </div>

      <ClientDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateClient}
      />
    </>
  );
}