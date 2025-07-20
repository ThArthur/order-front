import React, { useEffect, useRef } from "react";
import { ChevronRight, Users } from "@geist-ui/icons";
import "./SelectClientStep.css";
import {useClientPagination} from "@/hooks/useClients";

const SelectClientStep = ({ selectClient }) => {
  const { clients, isLoadingClients, hasMore, sentinelRef } = useClientPagination();



  return (
    <div className="client-step-container">
      <label>Para qual cliente deseja criar o pedido?</label>

      <div className="client-list-container">
        <div className="client-list-title">
          <Users />
          Todos clientes
        </div>

        <div className="client-list-wrapper">
          {clients?.map((client) => (
            <div
              key={client.id}
              className="client-container"
              onClick={() => selectClient(client)}
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
              Carregando mais clientes...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectClientStep;
