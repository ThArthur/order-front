import React from 'react';
import './index.css';

const ClientTable = ({ clients }) => {
  return (
    <div className="table-wrapper">
      <table className="client-table">
        <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Telefone</th>
        </tr>
        </thead>
        <tbody>
        {clients.map((client, index) => (
          <tr key={index}>
            <td>{client.name}</td>
            <td>{client.email}</td>
            <td>{client.phone}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;