import React, { useEffect, useRef, useState } from "react";
import api from "@/axios/api";
import { ChevronRight, Users } from "@geist-ui/icons";
import "./SelectClientStep.css";

const SelectClientStep = ({ orderData, setOrderData, onNext }) => {
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);

  useEffect(() => {
    api.get("client", { params: { page } }).then((response) => {
      setClients((prev) => [...prev, ...response.data.content]);
      if (response.data.last) setHasMore(false);
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
      { threshold: 1.0 }
    );

    const current = sentinelRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore]);

  const handleSelectClient = (client) => {
    setOrderData({ ...orderData, client });
    onNext();
  };

  return (
    <div className="client-step-container">
      <label>Para qual cliente deseja criar o pedido?</label>

      <div className="client-list-container">
        <div className="client-list-title">
          <Users />
          Todos clientes
        </div>

        <div className="client-list-wrapper">
          {clients.map((client) => (
            <div
              key={client.id}
              className="client-container"
              onClick={() => handleSelectClient(client)}
            >
              <label>{client.name}</label>
              <label>
                <ChevronRight />
              </label>
            </div>
          ))}

          {hasMore && (
            <div
              ref={sentinelRef}
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              Carregando outros clientes...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectClientStep;
