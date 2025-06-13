import { createContext, useContext, useEffect, useState } from "react";
import { getColors } from "../actions/personalization";

const ColorsContext = createContext(null);

export function ColorsProvider({ children }) {
  const [colors, setColors] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getColors()
      .then(setColors)
      .finally(() => setLoading(false));
  }, []);

  return (
    <ColorsContext.Provider value={{ colors, loading }}>
      {children}
    </ColorsContext.Provider>
  );
}

export function useColors() {
  const context = useContext(ColorsContext);
  if (!context) throw new Error("useColors must be used within a ColorsProvider");
  return context;
}
