import { useContext, createContext } from "react";

const PageContext = createContext();

const usePage = () => {
     const context = useContext(PageContext);
     if (!context) {
          throw new Error("usePage must be used within Page");
     }

     return context;
};

const FrigoContext = createContext();

const useFrigo = () => {
     const context = useContext(FrigoContext);
     if (!context) {
          throw new Error("useFrigo must be used within FrigoC");
     }

     return context;
};

const MenuContext = createContext();

const useMenu = () => {
     const context = useContext(MenuContext);
     if (!context) {
          throw new Error("useMenu must be used within MenuC");
     }

     return context;
};

export { PageContext, usePage, FrigoContext, useFrigo, MenuContext, useMenu };
