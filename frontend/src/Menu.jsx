import { PageContext, usePage, MenuContext, useMenu } from "./Context";
import { X, Plus, Minus, CheckCheck } from "lucide-react";
import logo from "./images/logo.jpg";
import { createPortal } from "react-dom";
import { useState, useMemo, createContext, useContext } from "react";

const DialogContext = createContext();

const useDialog = () => {
     const context = useContext(DialogContext);

     if (!context) {
          throw new Error("useDialog must be used within Dialog");
     }

     return context;
};

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

const DialogTrigger = () => {
     const { setOpen } = useDialog();
     return (
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
               Créer un nouveau menu
          </button>
     );
};

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

function FormAddMenu({ setMenus, menus }) {
     const { setOpen } = useDialog();
     const [food, setFood] = useState("");
     const [valeur, setValeur] = useState("");
     const [badge, setBadge] = useState("");
     const [listFood, setListFood] = useState([]);

     const handleClick = () => {
          if (food.trim().length) setListFood([...listFood, food]);
          setFood("");
     };

     const handleDelete = (f) => {
          setListFood(listFood.filter((food) => food !== f));
          console.log(listFood);
     };

     const handleBadge = () => {
          setBadge(valeur);
          setValeur("");
     };

     const handleSubmit = (e) => {
          e.preventDefault();

          const newMenu = {
               id: menus.length + 1,
               listFood: listFood,
               badge: badge,
          };

          setMenus([...menus, newMenu]);

          e.currentTarget.reset();
          setOpen(false);
     };

     return (
          <form onSubmit={handleSubmit}>
               <div className="join form-control">
                    <input
                         type="text"
                         className="input input-bordered"
                         placeholder="Ajouter un aliment"
                         value={food}
                         onChange={(e) => {
                              setFood(e.target.value);
                         }}
                    />
                    <button
                         type="button"
                         onClick={handleClick}
                         className="btn btn-primary"
                    >
                         <Plus />
                    </button>
               </div>
               <ul className="list-disc pl-5 my-4">
                    {listFood.map((f, index) => (
                         <li
                              key={index}
                              className="flex justify-between items-center mb-1"
                         >
                              {f}{" "}
                              <button
                                   type="button"
                                   className="btn btn-error btn-sm"
                                   onClick={() => handleDelete(f)}
                              >
                                   Supprimer
                              </button>
                         </li>
                    ))}
               </ul>
               {badge === "" ? (
                    <div className="form-control">
                         <div className="join">
                              <input
                                   type="text"
                                   className="input input-bordered"
                                   value={valeur}
                                   onChange={(e) => setValeur(e.target.value)}
                                   placeholder="Ajotuer un badge"
                                   required
                              />
                              <button className="btn" onClick={handleBadge}>
                                   <CheckCheck />
                              </button>
                         </div>
                    </div>
               ) : (
                    <div className="badge badge-primary mt-4">{badge}</div>
               )}
               <button type="submit" className="btn btn-primary w-full mt-6">
                    Créer
               </button>
          </form>
     );
}

function Menu(props) {
     return (
          <div className="card bg-base-100 shadow-xl">
               <div className="card-body">
                    <ul className="list-disc pl-5">
                         {props.listFood.map((f, index) => (
                              <li key={index}>{f}</li>
                         ))}
                    </ul>
                    <div className="card-actions justify-between">
                         <div className="badge badge-primary">
                              {props.badge}
                         </div>
                         <button
                              className="btn btn-error btn-sm"
                              onClick={() => props.onDelete?.()}
                         >
                              Supprimer
                         </button>
                    </div>
               </div>
          </div>
     );
}

function Menus() {
     const { setPage } = usePage();
     const { menus, setMenus } = useMenu();

     const handleDelete = (id) => {
          setMenus(menus.filter((menu) => menu.id !== id));
     };

     return (
          <div
               className="bg-base-200"
               style={{ minHeight: "calc(100vh - 130px)", paddingTop: "130px" }}
          >
               <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="flex justify-center items-center gap-4 mb-8">
                         <h1 className="text-4xl font-bold">Vos menus</h1>
                         <img
                              src={logo}
                              alt="Logo"
                              className="w-20 h-20 mr-2 rounded-field"
                         />
                    </div>
                    <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-1">
                         <div className="lg:col-span-3 md:col-span-1">
                              <div className="space-y-4">
                                   {menus.length > 0 ? (
                                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                                             {menus.map((menu) => (
                                                  <Menu
                                                       key={menu.id}
                                                       {...menu}
                                                       onDelete={() =>
                                                            handleDelete(
                                                                 menu.id
                                                            )
                                                       }
                                                  />
                                             ))}
                                        </div>
                                   ) : (
                                        <div
                                             role="alert"
                                             className="alert alert-info max-w-2xl mx-auto"
                                        >
                                             <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  className="stroke-current shrink-0 w-6 h-6"
                                             >
                                                  <path
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       strokeWidth="2"
                                                       d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                  ></path>
                                             </svg>
                                             <span>
                                                  Vous n'avez aucun menu.
                                             </span>
                                        </div>
                                   )}
                              </div>
                         </div>
                         <div className="lg:col-span-1 md:col-span-1">
                              <div className="sticky top-40">
                                   <div className="flex flex-col gap-4">
                                        <Dialog>
                                             <DialogTrigger />
                                             <DialogContent>
                                                  <div className="flex justify-between items-center">
                                                       <h3 className="text-lg font-bold mb-4">
                                                            Créer un nouveau
                                                            menu
                                                       </h3>
                                                       <DialogClose />
                                                  </div>
                                                  <hr />
                                                  <FormAddMenu
                                                       setMenus={setMenus}
                                                       menus={menus}
                                                  />
                                             </DialogContent>
                                        </Dialog>
                                        <button
                                             className="btn btn-ghost"
                                             onClick={() => {
                                                  setPage(0);
                                             }}
                                        >
                                             Revenir à l'accueil
                                        </button>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}

export default Menus;
