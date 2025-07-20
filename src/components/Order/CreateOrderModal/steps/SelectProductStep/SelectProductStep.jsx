import React, {useEffect, useRef, useState} from 'react';
import api from "@/axios/api";
import {Box} from "@geist-ui/icons";
import './SelectProductStep.css'
import {Checkbox} from "@mui/material";

const SelectProductStep = ({orderData, selectProduct, changeQuantity}) => {
  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);

  const handleProductQuantity = (productId, quantity) => {
    selectProduct({
      ...orderData.products.find(p => p.id === productId),
      quantity
    });
  };

  useEffect(() => {
    setProducts([])
  }, []);

  useEffect(() => {
    api.get("product", {
      params: {
        page: page,
      },
    }).then((response) => {
      setProducts((prev) => [...prev, ...response.data.content.map(product => ({ ...product, quantity: 1 }))]);

      if (response.data.last) {
        setHasMore(false);
      }
    });
  }, [page]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      {threshold: 1.0}
    );

    const current = sentinelRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore]);

  return (
    <div className="product-step-container">
      <label>
        Informe os produtos para Prosseguimos com a criação do pedido para o(a) cliente
        <label style={{fontWeight: 'bold'}}>
          {" " + orderData?.client?.name}
        </label>
      </label>

      <div className="product-list-container">
        <div className="product-list-title">
          <Box/>
          Todos Produtos
        </div>

        <div>
          {
            products?.map((product) => (
              <div
                key={product.id}
                className="product-container"
                onClick={() => {
                  selectProduct(product)
                }}
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
                    orderData.products.some(p => p.id === product.id) ?
                      <input
                        style={{marginLeft: '10px', width: '60px', height: "25px"}}
                        value={orderData.products.find(p => p.id === product.id)?.quantity || 0}
                        onChange={(e) => changeQuantity(product, parseInt(e.target.value))}
                        onClick={(e) => e.stopPropagation()}
                      /> :
                      <div/>
                  }
                  <label>
                    {
                      Intl.NumberFormat('pt-BR',
                        {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(product.price || 0)
                    }
                  </label>
                </div>

              </div>
            ))
          }

          {hasMore && (
            <div ref={sentinelRef} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              Carregando outros produtos...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectProductStep;