'use client'

import React, {useEffect, useState} from 'react';
import './index.css';
import {ChevronLeft, ChevronRight} from "@geist-ui/icons";
import api from "@/axios/api";


const CustomTable = ({columns, endpoint, itemsPerPage = 20, reloadTable}) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const fetchData = async (page = 0) => {
    try {
      setLoading(true);
      const response = await api.get(`${endpoint}?page=${page}&size=${itemsPerPage}`);
      setData(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.number);
    } catch (error) {
      console.error('Erro ao buscar dados da tabela:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, reloadTable]);

  return (
    <div className="table-wrapper">
      <div className="general-mobile-body">
        {
          data.map((item, index) => (
            <div className="table-background mobile-item" key={item.id || index}>
              {
                columns.map((column, index) => (
                  <div key={column + index} className="mobile-item-wrapper">
                    <div>
                      {column.label}:
                    </div>
                    <div>
                      {column.render ? column.render(item) : item[column.field]}
                    </div>
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>

      <table id="custom-table">
        <thead className="table-header desktop-table">
        <tr>
          {
            columns.map((column, index) => (
              <td key={index} className={["font-thin", column.autoCol ? "auto-width" : ""]}>
                {column.label}
              </td>
            ))
          }
        </tr>
        </thead>

        <tbody className="table-body desktop-table">
        {
          loading ?
            (
              <tr>
                <td colSpan={columns.length} style={{textAlign: 'center', padding: '16px'}}>
                  Carregando...
                </td>
              </tr>
            )
            : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={{textAlign: 'center', padding: '16px'}}>
                    Nenhum registro encontrado...
                  </td>
                </tr>
              ) :
              <>
                {
                  data.map((item, index) => (
                    <tr className="table-border table-background" key={item.id || index}>
                    {columns.map((column, colIndex) => (
                      <td id="overflow-text" key={colIndex}
                          className={`body-padding ${column.autoCol ? "auto-width" : ""}`}>
                        {column.render ? column.render(item) : item[column.field]}
                      </td>
                    ))}
                  </tr>
                ))
              }
            </>
        }

        </tbody>

        <tfoot id="table-footer">
        <tr className="table-border table-background">
          <td colSpan={columns.length}>
            <div className="pagination">
              <span>Página {currentPage + 1} de {totalPages}</span>
              <button
                className="page-button"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0}
              >
                <ChevronLeft/>
              </button>
              <button
                className="page-button"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage + 1 >= totalPages}
              >
                <ChevronRight/>
              </button>
            </div>
          </td>
        </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default CustomTable;