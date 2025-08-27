import { Search } from "lucide-react";
import { useState } from "react";

import { PageContext, usePage, FrigoContext, MenuContext } from "./Context";

import Navbar from "./Navbar";
import Accueil from "./Accueil";
import Frigo from "./Frigo";
import Menus from "./Menu";

const MenuC = ({ children }) => {
     const [menus, setMenus] = useState([]);

     return (
          <MenuContext.Provider value={{ menus, setMenus }}>
               {children}
          </MenuContext.Provider>
     );
};

const FrigoC = ({ children }) => {
     const [foods, setFoods] = useState([]);

     return (
          <FrigoContext.Provider value={{ foods, setFoods }}>
               {children}
          </FrigoContext.Provider>
     );
};

const Page = ({ children }) => {
     const [page, setPage] = useState(0);

     return (
          <PageContext.Provider value={{ page, setPage }}>
               {children}
          </PageContext.Provider>
     );
};

function PageContent() {
     const { page } = usePage();

     let content;
     switch (page) {
          case 0:
               content = <Accueil />;
               break;
          case 1:
               content = <Frigo />;
               break;
          case 2:
               content = <Menus />;
     }

     return <div>{content}</div>;
}

function App() {
     return (
          <div style={{ minHeight: "100vh" }}>
               <Page>
                    <FrigoC>
                         <MenuC>
                              <Navbar />
                              <PageContent />
                         </MenuC>
                    </FrigoC>
               </Page>
          </div>
     );
}

export default App;
