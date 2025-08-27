import { usePage } from "./Context";
import logo from "./images/logo.jpg";

// Composant de la page d'accueil
function Accueil() {
    const { setPage } = usePage(); // Permet de changer la page affichée

    return (
        // Section principale avec un fond et une hauteur adaptée
        <div
            className="hero bg-base-200"
            style={{ height: "calc(100vh - 130px)" }}
        >
            <div className="hero-content text-center">
                <div className="max-w-md">
                    {/* Titre de la page et logo */}
                    <div className="flex justify-center items-baseline gap-4 mb-8">
                        <h1 className="text-5xl font-bold">
                            Bienvenue sur
                            <span className="inline-block">Food Harmony</span>
                        </h1>
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-25 h-25 mr-2 rounded-field self-center"
                        />
                    </div>
                    {/* Slogan */}
                    <p className="py-6">Votre frigo dans votre poche</p>
                </div>
                {/* Boutons d'action principaux */}
                <div>
                    <button className="btn btn-primary mx-2">
                        Proposer une liste de courses
                    </button>
                    <button
                        className="btn btn-primary mx-2"
                        onClick={() => {
                            setPage(2); // Redirige vers la page de création de menu
                        }}
                    >
                        Créer un nouveau menu
                    </button>
                    <button className="btn btn-primary mx-2">
                        Proposer un menu
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Accueil;
