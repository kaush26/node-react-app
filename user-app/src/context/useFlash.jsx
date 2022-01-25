import React from "react";

export const useFlash = React.createContext({
  flash: { message: null, state: 0 },
  setFlash: () => {},
});
