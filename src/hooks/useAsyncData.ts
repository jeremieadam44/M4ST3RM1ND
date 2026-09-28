import { useCallback, useEffect, useState } from "react";

interface AsyncData<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useAsyncData<T>(fetcher: () => Promise<T>): AsyncData<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetcher());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Une erreur inattendue est survenue.",
      );
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, loading, error, reload };
}
