import React, {useState} from 'react';
import './ConfirmOrderStep.css'
import {ChevronDown, ChevronUp} from "@geist-ui/icons";

const ConfirmOrderStep = ({ orderData }) => {
  const [expanded, setExpanded] = useState(true);

  const formatQuantity = (product) => {
    return product.quantity ? `${product.quantity}x ${product.name}` : `1x ${product.name}`;
  }

  const formatPrice = (product) => {
    const quantity = product.quantity || 1
    const total = product.price * quantity;

    return total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  const formatOrderTotalValue = (products) => {
    const total = products.reduce((sum, product) => {
      const quantity = product.quantity || 1;
      return sum + (product.price * quantity);
    }, 0);

    return total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="confirm-order-container">
      <label>
        <p>
          Abaixo estão as informações essenciais para a finalização do pedido.
        </p>
        <p>

          Verifique os dados do cliente, seu limite de crédito disponível e os gastos já realizados no período.
        </p>
      </label>

      <div className="confirm-order-label">
        <label className="title-label">
          Cliente:
        </label>
        <label>{orderData?.client?.name}</label>
      </div>

      <div className="confirm-order-label">
        <label className="title-label">
          Limite:
        </label>
        <label>
          {
            Intl.NumberFormat('pt-BR',
              {
                style: 'currency',
                currency: 'BRL'
              }).format(orderData?.client?.creditLimit || 0)
          }
        </label>
      </div>

      <div className="confirm-order-label">
        <label className="title-label">
          Gastos:
        </label>
        <label>
          {
            Intl.NumberFormat('pt-BR',
              {
                style: 'currency',
                currency: 'BRL'
              }).format(orderData?.client?.spendThisMonth || 0)
          }
        </label>
      </div>

      <div className="confirm-order-label">
        <label className="title-label">
          Valor total do pedido:
        </label>
        <label>
          {
            formatOrderTotalValue(orderData.products)
          }
        </label>
      </div>

      {
        orderData.products.length > 0 &&
        <div className="expansion-container">
          <button
            className="see-more-button"
            onClick={() => setExpanded(prev => !prev)}
          >
            {expanded ? 'Ver menos' : 'Ver mais'}
            {expanded ? <ChevronUp/> : <ChevronDown/>}

          </button>
          <div className={`see-more-container ${expanded && 'expanded'}`}>
            {
              orderData.products.map((product) => (
                <div key={product.id} className="product-list-see-more">
                  <div className="product-list-item">
                    {formatQuantity(product)}
                  </div>
                  <div>
                    {
                      formatPrice(product)
                    }
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      }


    </div>
  );
};

export default ConfirmOrderStep;