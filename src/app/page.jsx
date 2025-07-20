'use client'

import './page.css'
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import CreateOrderModal from "@/components/Order/CreateOrderModal/CreateOrderModal";
import {Alert, Paper, Snackbar} from "@mui/material";
import {DataGrid} from '@mui/x-data-grid';
import api from "@/axios/api";
import CustomTable from "@/components/CustomTable/CustomTable";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const onRequestClose = () => setIsOpen(false);
  const onRequestOpen = () => setIsOpen(true);

  const [orderStatus, setOrderStatus] = useState("")

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  useEffect(() => {
    if (!orderStatus) return

    if (orderStatus === "REJEITADO") {
      setToastMessage(`Pedido criado com o status REJEITADO`);
      setToastSeverity('error');
    } else {
      setToastMessage(`Pedido criado com o status APROVADO`);
      setToastSeverity('success');
    }

    setToastOpen(true);
    setReloadTable(prevState => !prevState);
  }, [orderStatus]);

  const columns = [
    {
      field: "orderId",
      label: "ID",
      autoCol: true
    },
    {
      field: "client",
      label: "Cliente",
      autoCol: true
    },
    {
      field: "status",
      label: "Status",
      autoCol: true,
      render: (item) => {
        return (
          <label
            style={{
              color: item.status === "REJEITADO" ? "red" : "green"
          }}
          >
            {item.status}
          </label>
        )
      }
    },
    {
      field: 'price',
      label: "Valor",
      autoCol: true,
      render: (item) => {
        return Intl.NumberFormat('pt-BR',
          {
            style: 'currency',
            currency: 'BRL'
          }).format(item.total || 0)
      },
    }
  ]

  const [reloadTable, setReloadTable] = useState(false);

  return (
    <>
      <div className="order-container">
        <h1>Pedidos</h1>

        <div>
          <Button variant="contained" onClick={onRequestOpen}>
            Novo Pedido
          </Button>
        </div>

        <CustomTable
          columns={columns}
          endpoint="/order"
          reloadTable={reloadTable}
        />

      </div>

      {isOpen &&
        <CreateOrderModal
          orderStatus={orderStatus => setOrderStatus(orderStatus)}
          onRequestClose={onRequestClose}
          onRequestOpen={onRequestOpen}
        />
      }

      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      >
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{width: '100%'}}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
}