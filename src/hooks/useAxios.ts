import { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/api/";

interface UseAxiosProps {
  url: string;
  method: "get" | "post" | "put" | "delete";
  body?: any | null;
  headers?: any | null;
}

const useAxios = <T>({
  url,
  method,
  body = null,
  headers = null,
}: UseAxiosProps) => {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const fetchData = () => {
    axios[method]<T>(url, JSON.parse(headers), JSON.parse(body))
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [method, url, body, headers]);

  return { response, error, loading };
};

export default useAxios;
