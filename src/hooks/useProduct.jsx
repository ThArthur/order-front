import {useCallback, useEffect, useRef, useState} from "react";
import api from "@/axios/api";

export function useProductPagination() {
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);

  const fetchedPages = useRef(new Set());
  const queueRef = useRef(Promise.resolve());

  const getProducts = useCallback(async (pageNumber) => {
    if (fetchedPages.current.has(pageNumber)) return;

    queueRef.current = queueRef.current.then(async () => {
      setIsLoadingProducts(true);
      try {
        const { data } = await api.get(`/product?page=${pageNumber}`);

        const newProducts = data.content.map((p) => ({ ...p, quantity: 1 }));

        setProducts((prev) => [...prev, ...newProducts]);
        setHasMore(!data.last);
        fetchedPages.current.add(pageNumber);
      } catch (e) {
        console.error("Erro ao carregar produtos:", e);
      } finally {
        setIsLoadingProducts(false);
      }
    });

    return queueRef.current;
  }, []);

  useEffect(() => {
    getProducts(page);
  }, [page, getProducts]);

  useEffect(() => {
    if (!hasMore || isLoadingProducts) return;

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
  }, [hasMore, isLoadingProducts]);

  return {
    products,
    isLoadingProducts,
    sentinelRef,
    hasMore,
    setPage,
  };
}