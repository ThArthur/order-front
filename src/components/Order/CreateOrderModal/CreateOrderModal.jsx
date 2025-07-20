import './CreateOrderModal.css'
import React, {use} from 'react';
import {Home} from "@geist-ui/icons";
import {OrderContext} from "@/providers/order";

const CreateOrderModal = () => {
  const { onRequestClose } = use(OrderContext)

  return (
    <dialog className="container-modal">
      <section className="dialog-container">
        <header className="dialog-header">
          <label>
            Criar Pedido
          </label>
          <button onClick={onRequestClose}>
            <Home />
          </button>
        </header>

        <article className="dialog-content">

        </article>
      </section>
    </dialog>
  );
};

export default CreateOrderModal;