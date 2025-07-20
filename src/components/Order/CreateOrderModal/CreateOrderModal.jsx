import './CreateOrderModal.css'
import React, {useState} from 'react';
import SelectClientStep from "@/components/Order/CreateOrderModal/steps/SelectClientStep/SelectClientStep";
import SelectProductStep from "@/components/Order/CreateOrderModal/steps/SelectProductStep/SelectProductStep";
import ConfirmOrderStep from "@/components/Order/CreateOrderModal/steps/ConfirmOrderStep/ConfirmOrderStep";
import api from "@/axios/api";

const CreateOrderModal = ({orderStatus, onRequestClose}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const [orderData, setOrderData] = useState({
    client: {},
    products: [],
  });

  const nextStep = async () => {
    if (currentStep === steps.length - 1) {
      await submitOrder()
      onRequestClose()
    }

    if (currentStep === 1) {
      const validProducts = orderData.products
        .filter(p => {
          const q = p.quantity;
          return q === undefined || (typeof q === 'number' && q > 0);
        })
        .map(p => ({
          ...p,
          quantity: p.quantity === undefined || p.quantity === null ? 1 : Number(p.quantity),
        }));

      setOrderData(prev => ({
        ...prev,
        products: validProducts,
      }));
    }

    if (!(currentStep === steps.length - 1)) {
      setCurrentStep(currentStep + 1);
    }
  }

  const backStep = () => {
    if (currentStep === 0) {
      alert("Já ta na primeira")
    }
    setCurrentStep(currentStep - 1);
  }

  const selectClient = (client) => {
    if (!client) {
      return;
    }
    setOrderData(prev => ({
      ...prev,
      client: client,
    }));

    nextStep()
  }

  const selectProduct = (product) => {
    if (!product) return;

    const alreadyAdded = orderData.products.some(p => p.id === product.id);

    if (alreadyAdded) {
      setOrderData(prev => ({
        ...prev,
        products: prev.products.filter(p => p.id !== product.id),
      }));
    } else {
      setOrderData(prev => ({
        ...prev,
        products: [...prev.products, product],
      }));
    }
  }

  const changeQuantity = (product, quantity) => {
    if (!product) return;

    setOrderData(prev => ({
      ...prev,
      products: prev.products.map(p =>
        p.id === product.id ? {...p, quantity} : p
      ),
    }));
  }

  const [loading, setLoading] = useState(false);
  const submitOrder = async () => {
    try {
      setLoading(true);
      const {data} = await api.post('order/create', {
        clientId: orderData.client.id,
        items: orderData.products.map(p => {
          return {
            productId: p.id,
            quantity: p.quantity || 1,
          }
        }),
      })

      orderStatus(data.status)

    } finally {
      setLoading(false);
    }
  }

  const steps = [
    {
      component: <SelectClientStep selectClient={selectClient}/>,
      allowNextButton: false,
      allowPreviousButton: false,
    },
    {
      component: <SelectProductStep
        orderData={orderData}
        selectProduct={selectProduct}
        changeQuantity={changeQuantity}/>,
      allowNextButton: true,
      allowPreviousButton: true,
    },
    {
      component: <ConfirmOrderStep orderData={orderData}/>,
      allowNextButton: true,
      allowPreviousButton: true,
      nextButtonLabel: "Finalizar"
    }
  ]

  const renderStepContent = () => {
    return steps[currentStep].component;
  }

  return (
    <dialog className="container-modal">
      <section className="dialog-container">
        <header className="dialog-header">
          <label className="header-title-dialog">
            Criar Pedido
          </label>
          <button className="close-dialog-button" onClick={onRequestClose}>
            X
          </button>
        </header>

        <article className="dialog-content">
          {renderStepContent()}
        </article>

        <footer className="dialog-footer">
          {
            steps[currentStep].allowPreviousButton &&
            <button
              onClick={backStep}
              className="step-button"
            >
              {
                steps[currentStep].previousButtonLabel || "Voltar"
              }
            </button>
          }

          {
            steps[currentStep].allowNextButton &&
            <button
              onClick={nextStep}
              className="step-button"
              disabled={loading}
            >
              {
                steps[currentStep].nextButtonLabel || "Avançar"
              }
            </button>
          }
        </footer>


      </section>
    </dialog>
  );
};

export default CreateOrderModal;