import React from 'react';
import './ConfirmOrderStep.css'
import {ChevronDown} from "@geist-ui/icons";

const ConfirmOrderStep = ({ orderData, onNext }) => {
  return (
    <div>
      <div>
        Cliente: <label>{orderData?.client?.name}</label>
      </div>
      <div>
        Limite: <label>{orderData?.client?.creditLimit}</label>
      </div>
      <div>
        Gastos: <label>{orderData?.client?.spendThisMonth}</label>
      </div>

      <div className="expansion-container">
        <button className="see-more-button">
          Ver mais
          <ChevronDown />
        </button>
        <div className="see-more-container">
          {
            orderData.products.map((product) => (
              <div>
                { product.name }
              </div>
            ))
          }
        </div>
      </div>

    </div>
  );
};

export default ConfirmOrderStep;