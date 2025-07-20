"use client"

import React, {use, useState} from "react";
import "./index.css"
import CustomTable from "@/components/CustomTable/CustomTable";
import ProductDialog from "@/components/product/ProductDialog";
import Button from "@mui/material/Button";
import api from "@/axios/api";

export default function ProductPage() {
  const [open, setOpen] = useState(false);
  const [reloadTable, setReloadTable] = useState(false);

  const handleCreateProduct = async (product) => {
    await api.post('product/create', product)
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
      field: 'price',
      label: "Valor",
      render: (item) => {
        return Intl.NumberFormat('pt-BR',
          {
            style: 'currency',
            currency: 'BRL'
          }).format(item.price || 0)
      },
      autoCol: true
    }
  ]


  return (
    <>
      <div className="product-page-container">
        <h1>Produtos</h1>

        <div>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Novo Produto
          </Button>
        </div>
        <CustomTable
          columns={columns}
          endpoint="/product"
          reloadTable={reloadTable}
        />
      </div>

      <ProductDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateProduct}
      />
    </>
  );
}