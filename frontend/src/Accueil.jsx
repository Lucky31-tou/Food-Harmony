import logo from "./images/logo.jpg";
import { X, Plus, Minus, CheckCheck } from "lucide-react";
import { useFrigo } from "./Context";
import { createPortal } from "react-dom";
import {
    useState,
    useContext,
    createContext,
    useMemo,
    useRef,
    useEffect,
} from "react";

// Contexte pour gérer l'ouverture/fermeture de la boîte de dialogue
const DialogContext = createContext();

// Hook personnalisé pour accéder au contexte Dialog
const useDialog = () => {
    const context = useContext(DialogContext);

    if (!context) {
        throw new Error("useDialog must be used within Dialog");
    }

    return context;
};

// Fournit le contexte Dialog à ses enfants
const Dialog = ({ children }) => {
    const [open, setOpen] = useState(0);

    const value = useMemo(
        () => ({
            open,
            setOpen,
        }),
        [open]
    );

    return (
        <DialogContext.Provider value={value}>
            {children}
        </DialogContext.Provider>
    );
};

// Bouton pour ouvrir la boîte de dialogue de création de menu
const DialogTrigger = () => {
    const { setOpen } = useDialog();
    return (
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
            Faire une liste de course
        </button>
    );
};

// Bouton pour fermer la boîte de dialogue
const DialogClose = () => {
    const { setOpen } = useDialog();
    return (
        <button
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => setOpen(false)}
        >
            <X />
        </button>
    );
};

// Contenu de la boîte de dialogue (formulaire de création de menu)
const DialogContent = ({ children }) => {
    const context = useDialog();

    if (!context.open) return;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="card w-96 bg-base-200 shadow-xl animate-in fade-in-50">
                <div className="card-body">{children}</div>
            </div>
        </div>,
        document.body
    );
};

// Formulaire pour ajouter un nouveau menu
function FormLlisteCourse({ foods, setFoods }) {
    const { setOpen } = useDialog();
    const [food, setFood] = useState("");
    const [sub, setSub] = useState(false);
    const [listFood, setListFood] = useState([]);
    const [sugg, setSugg] = useState([]);
    const [showSugg, setShowSugg] = useState(false);
    const menuRef = useRef(null);

    const foodsname = foods.map((food) => food.foodname);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowSugg(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Ajoute un aliment à la liste du menu
    const handleClick = () => {
        if (foodsname.includes(food)) {
            if (food.trim().length) {
                const newFood = {
                    foodname: food,
                    quantity: 0,
                };
                setListFood([...listFood, newFood]);
            }
            setFood("");
            if (!sub) setSub(true);
        } else {
            alert("Vous devez d'abord ajouter cette aliment dans votre frigo");
        }
    };

    // Gestionnaire pour la touche Entrée
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Empêche la soumission du formulaire
            handleClick();
        }
    };

    // Supprime un aliment de la liste du menu
    const handleDelete = (f) => {
        const newListFood = listFood.filter((food) => food.foodname !== f);
        setListFood(newListFood);
        if (newListFood.length === 0) {
            setSub(false);
        }
    };

    // Soumet le formulaire et ajoute le menu à la liste
    const handleSubmit = (e) => {
        e.preventDefault();

        alert(
            "Tous les aliments que vous avez acheté ont été ajouté à votre frigo."
        );

        listFood.map(async (f) => {
            const foodObj = foods.find((food) => food.foodname === f.foodname);
            const id = foodObj?.id; // "?" pour éviter une erreur si introuvable

            let updatedFood = {
                foodname: f.foodname,
                // CORRECTION : Convertir f.quantity en nombre aussi
                quantity: Number(foodObj.quantity) + Number(f.quantity),
            };

            try {
                const response = await fetch(`/api/foods/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedFood),
                });
                if (response.ok) {
                    const result = await response.json();
                    setFoods((prevFoods) =>
                        prevFoods.map((food) =>
                            food.id === id ? result : food
                        )
                    );
                }
            } catch (error) {
                console.error(
                    "Erreur lors de la mise à jour de la quantité:",
                    error
                );
            }
        });

        setFood("");
        setListFood([]);
        setSub(false);
        setSugg([]);
        setShowSugg(false);
        setOpen(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="relative" ref={menuRef}>
                {/* Champ pour ajouter un aliment */}
                <div className="join form-control">
                    <input
                        type="text"
                        className="input input-bordered"
                        placeholder="Ajouter un aliment"
                        value={food}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            setFood(inputValue);

                            if (inputValue.trim() === "") {
                                setShowSugg(false);
                                setSugg([]);
                            } else {
                                const filteredSugg = foodsname.filter((f) =>
                                    f
                                        .toLowerCase()
                                        .startsWith(inputValue.toLowerCase())
                                );
                                setSugg(filteredSugg);
                                setShowSugg(filteredSugg.length > 0);
                            }
                        }}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        type="button"
                        onClick={handleClick}
                        className="btn btn-primary"
                    >
                        <CheckCheck />
                    </button>
                </div>
                {showSugg && sugg.length > 0 ? (
                    <ul className="absolute z-10 w-full bg-base-100 shadow-lg rounded-box mt-1">
                        {sugg.map((s, index) => (
                            <li
                                key={index}
                                onClick={() => {
                                    setFood(s);
                                    setShowSugg(false);
                                }}
                                className="p-2 cursor-pointer hover:bg-base-300"
                            >
                                {s}
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
            {/* Liste des aliments ajoutés */}
            <ul className="list-disc pl-5 my-4">
                {listFood.map((f, index) => (
                    <li
                        key={index}
                        className="flex justify-between items-center p-2 rounded-lg bg-base-100 mb-2"
                    >
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="food"
                                id={f.foodname}
                                className="checkbox checkbox-primary"
                                required
                            />
                            <label htmlFor={f.foodname}>{f.foodname}</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor={f.foodname + "qt"}>
                                Quantité :{" "}
                            </label>
                            <input
                                type="number"
                                className="input input-bordered input-xs w-20"
                                value={f.quantity}
                                onChange={(e) => {
                                    // CORRECTION : Utiliser map() pour conserver l'ordre
                                    const newListFood = listFood.map((food) =>
                                        food.foodname === f.foodname
                                            ? {
                                                  ...food,
                                                  quantity: e.target.value,
                                              }
                                            : food
                                    );
                                    setListFood(newListFood);
                                }}
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-ghost btn-xs btn-circle"
                            onClick={() => handleDelete(f.foodname)}
                        >
                            <X size={16} />
                        </button>
                    </li>
                ))}
            </ul>
            {/* Bouton pour soumettre le formulaire */}
            {sub ? (
                <button type="submit" className="btn btn-primary w-full mt-6">
                    Confirmer mes achats
                </button>
            ) : null}
        </form>
    );
}

// Composant de la page d'accueil
function Accueil() {
    const { foods, setFoods } = useFrigo();

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
                    <Dialog>
                        <DialogTrigger />
                        <DialogContent>
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold mb-4">
                                    Liste de courses
                                </h3>
                                <DialogClose />
                            </div>
                            <hr />
                            <FormLlisteCourse
                                foods={foods}
                                setFoods={setFoods}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default Accueil;
