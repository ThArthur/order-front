import { useCallback, useEffect, useRef, useState } from "react";
import api from "@/axios/api";

export function useClientPagination() {
  const [clients, setClients] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);

  const fetchedPages = useRef(new Set());

  const queueRef = useRef(Promise.resolve());

  const getClients = useCallback(async (pageNumber) => {
    if (fetchedPages.current.has(pageNumber)) return;

    queueRef.current = queueRef.current.then(async () => {
      setIsLoadingClients(true);
      try {
        const { data } = await api.get(`/client?page=${pageNumber}`);

        setClients((prev) => [...prev, ...data.content]);
        setHasMore(!data.last);
        fetchedPages.current.add(pageNumber);
      } catch (e) {
        console.error("Erro ao carregar clientes:", e);
      } finally {
        setIsLoadingClients(false);
      }
    });

    return queueRef.current;
  }, []);

  useEffect(() => {
    getClients(page).then();
  }, [page]);

  useEffect(() => {
    if (!hasMore || isLoadingClients) return;

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
  }, [hasMore, isLoadingClients]);

  return {
    clients,
    isLoadingClients,
    sentinelRef,
    hasMore,
    setPage,
  };
}
