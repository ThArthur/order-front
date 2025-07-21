import React from 'react';
import { Box } from "@geist-ui/icons";
import './SelectProductStep.css';
import { Checkbox } from "@mui/material";
import {useProductPagination} from "@/hooks/useProduct";

const SelectProductStep = ({ orderData, selectProduct, changeQuantity }) => {
  const {
    products,
    isLoadingProducts,
    sentinelRef,
    hasMore
  } = useProductPagination();

  return (
    <div className="product-step-container">
      <label>
        Informe os produtos para Prosseguimos com a criação do pedido para o(a) cliente
        <label style={{ fontWeight: 'bold' }}>
          {" " + orderData?.client?.name}
        </label>
      </label>

      <div className="product-list-container">
        <div className="product-list-title">
          <Box />
          Todos Produtos
        </div>

        <div>
          {products?.map((product) => (
            <div
              key={product.id}
              className="product-container"
              onClick={() => selectProduct(product)}
            >
              <div className="item-selected">
                <Checkbox
                  type="checkbox"
                  checked={orderData.products.some(p => p.id === product.id)}
                  readOnly
                />
                <label>{product?.name}</label>
              </div>
              <div className="item-quantity-wrapper">
                {
                  orderData.products.some(p => p.id === product.id) ? (
                    <input
                      style={{ marginLeft: '10px', width: '60px', height: "25px" }}
                      value={orderData.products.find(p => p.id === product.id)?.quantity || 0}
                      onChange={(e) => changeQuantity(product, parseInt(e.target.value))}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : <div />
                }
                <label>
                  {
                    Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(product.price || 0)
                  }
                </label>
              </div>
            </div>
          ))}

          {hasMore && (
            <div ref={sentinelRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {isLoadingProducts ? "Carregando outros produtos..." : "Desça para carregar mais"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectProductStep;
