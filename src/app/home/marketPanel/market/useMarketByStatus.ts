import { useGetAllMarketBooksQuery } from "@/api/marketApi";
import { MarketBookStatus } from "@interfaces/MarketBook";

export function useMarketByStatus(status?: MarketBookStatus) {
  const { data, isLoading, isError, error } = useGetAllMarketBooksQuery({
    status,
  });
  return { data, isLoading, isError, error };
}
