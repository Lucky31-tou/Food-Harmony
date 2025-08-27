import { Search } from "lucide-react";
import { useState } from "react";

import { PageContext, usePage, FrigoContext, MenuContext } from "./Context";

import Navbar from "./Navbar";
import Accueil from "./Accueil";
import Frigo from "./Frigo";
import Menus from "./Menu";

// Contexte pour gérer les menus
const MenuC = ({ children }) => {
    const [menus, setMenus] = useState([]); // Liste des menus

    return (
        <MenuContext.Provider value={{ menus, setMenus }}>
            {children}
        </MenuContext.Provider>
    );
};

// Contexte pour gérer les aliments du frigo
const FrigoC = ({ children }) => {
    const [foods, setFoods] = useState([]); // Liste des aliments

    return (
        <FrigoContext.Provider value={{ foods, setFoods }}>
            {children}
        </FrigoContext.Provider>
    );
};

// Contexte pour gérer la page courante (Accueil, Frigo, Menus)
const Page = ({ children }) => {
    const [page, setPage] = useState(0); // 0: Accueil, 1: Frigo, 2: Menus

    return (
        <PageContext.Provider value={{ page, setPage }}>
            {children}
        </PageContext.Provider>
    );
};

// Affiche le contenu de la page selon la valeur de 'page'
function PageContent() {
    const { page } = usePage();

    let content;
    switch (page) {
        case 0:
            content = <Accueil />; // Page d'accueil
            break;
        case 1:
            content = <Frigo />; // Page frigo
            break;
        case 2:
            content = <Menus />; // Page menus
    }

    return <div>{content}</div>;
}

// Composant principal de l'application
function App() {
    return (
        <div style={{ minHeight: "100vh" }}>
            {/* Fournit les contextes à toute l'application */}
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
