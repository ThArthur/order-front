import React, {useEffect, useRef, useState} from 'react';
import api from "@/axios/api";
import {ChevronRight, Users} from "@geist-ui/icons";
import './SelectProductStep.css'

const SelectProductStep = ({ orderData, setOrderData, onNext }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);

  useEffect(() => {
    api.get("product", {
      params: {
        page: page,
      },
    }).then((response) => {
      setProducts((prev) => [...prev, ...response.data.content]);

      if (response.data.last) {
        setHasMore(false);
      }
    });
  }, [page]);

  const handleToggleProduct = (product) => {
    setSelectedProducts((prev) =>
      prev.includes(product)
        ? prev.filter(p => p !== product)
        : [...prev, product]
    );
    setOrderData((prev) =>
      prev.includes(product)
        ? prev.filter(p => p !== product)
        : [...prev, product]
    );
  };

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
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
          { " " + orderData?.client.name }
        </label>
      </label>

      <div className="product-list-container">
        <div className="product-list-title">
          <Users />
          Todos Produtos
        </div>

        <div>
          {
            orderData?.products.map((product) => (
              <div
                key={product.id}
                className="product-container"
                onClick={() => {handleToggleProduct(product)}}
              >
                <div className="item-selected">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product)}
                    readOnly
                  />
                  <label>{product?.name}</label>
                </div>
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