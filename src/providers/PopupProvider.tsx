import React, { createContext, useContext, useState, ReactNode } from "react";

export enum PopupType {
  BOOKSHELF_ADD,
  BOOKSHELF_UPDATE,
  MARKET_ADD,
  MARKET_UPDATE,
}

interface PopupContextValue {
  openPopupId: PopupType | null;
  setOpenPopupType: (type: PopupType | null) => void;
}

const PopupContext = createContext<PopupContextValue | undefined>(undefined);

export const PopupProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [openPopupType, setOpenPopupType] = useState<PopupType | null>(null);

  return (
    <PopupContext.Provider
      value={{ openPopupId: openPopupType, setOpenPopupType }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = (): PopupContextValue => {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error("usePopup must be used within PopupProvider");
  return ctx;
};
