import { PageContext, usePage, FrigoContext, useFrigo } from "./Context";
import { X, Plus, Minus } from "lucide-react";
import logo from "./images/logo.jpg";
import { createPortal } from "react-dom";
import { useState, useContext, createContext, useMemo } from "react";

const DialogContext = createContext(null);

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
               Ajouter un aliment
          </button>
     );
};

const DialogClose = () => {
     const { setOpen } = useDialog();
     return (
          <button
               className="btn btn-sm btn-circle btn-ghost"
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

function FormAddFood({ setFoods, foods }) {
     const { setOpen } = useDialog();

     const handleSubmit = (e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);

          const newFood = {
               id: foods.length + 1,
               name: formData.get("name"),
               quantity: formData.get("quantity"),
               type: formData.get("type"),
          };

          setFoods([...foods, newFood]);

          e.currentTarget.reset();
          setOpen(false);
     };

     return (
          <form onSubmit={handleSubmit}>
               <div className="form-control">
                    <label htmlFor="name">
                         <span className="label-text">Nom : </span>
                         <input
                              className="input input-bordered"
                              type="text"
                              name="name"
                              id="name"
                              required
                         />
                    </label>
               </div>
               <div className="form-control">
                    <label htmlFor="quantity">
                         <span className="label-text">Quantité : </span>
                         <input
                              className="input input-bordered"
                              type="number"
                              name="quantity"
                              id="quantity"
                              required
                         />
                    </label>
               </div>
               <div className="form-control">
                    <label htmlFor="type">
                         <span className="label-text">Type : </span>
                         <input
                              className="input input-bordered"
                              type="text"
                              name="type"
                              id="type"
                              required
                         />
                    </label>
               </div>
               <div className="form-control mt-6">
                    <button className="btn btn-primary" type="submit">
                         Ajouter
                    </button>
               </div>
          </form>
     );
}

const Food = (props) => {
     return (
          <div className="card bg-base-100 shadow-xl">
               <div className="card-body">
                    <h2 className="card-title">{props.name}</h2>
                    <div className="card-actions justify-end items-center">
                         <button
                              className="btn btn-square btn-sm"
                              onClick={() => props.decrement?.()}
                         >
                              <Minus />
                         </button>
                         <p>
                              Il vous reste {props.quantity} {props.type}
                         </p>
                         <button
                              className="btn btn-square btn-sm"
                              onClick={() => props.increment?.()}
                         >
                              <Plus />
                         </button>
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
};

function Frigo() {
     const { setPage } = usePage();
     const { foods, setFoods } = useFrigo();

     const handleDelete = (id) => {
          setFoods(foods.filter((food) => food.id !== id));
     };

     const handleIncrement = (id) => {
          setFoods((prevFoods) =>
               prevFoods.map((food) =>
                    food.id === id
                         ? { ...food, quantity: Number(food.quantity) + 1 }
                         : food
               )
          );
     };

     const handleDecrement = (id) => {
          setFoods((prevFoods) =>
               prevFoods.map((food) =>
                    food.id === id
                         ? {
                                ...food,
                                quantity: Math.max(
                                     0,
                                     Number(food.quantity) - 1
                                ),
                           }
                         : food
               )
          );
     };

     return (
          <div
               className="bg-base-200"
               style={{ minHeight: "calc(100vh - 130px)", paddingTop: "130px" }}
          >
               <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="flex justify-center items-center gap-4 mb-8">
                         <h1 className="text-4xl font-bold">Votre Frigo</h1>
                         <img
                              src={logo}
                              alt="Logo"
                              className="w-20 h-20 mr-2 rounded-field"
                         />
                    </div>
                    <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-1">
                         <div className="lg:col-span-3 md:col-span-1">
                              <div className="space-y-4">
                                   {foods.length > 0 ? (
                                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                                             {foods.map((food) => (
                                                  <Food
                                                       key={food.id}
                                                       {...food}
                                                       onDelete={() =>
                                                            handleDelete(
                                                                 food.id
                                                            )
                                                       }
                                                       increment={() =>
                                                            handleIncrement(
                                                                 food.id
                                                            )
                                                       }
                                                       decrement={() =>
                                                            handleDecrement(
                                                                 food.id
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
                                             <span>Votre frigo est vide.</span>
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
                                                       <h3 className="text-lg font-bold">
                                                            Ajouter un aliment
                                                       </h3>
                                                       <DialogClose />
                                                  </div>
                                                  <FormAddFood
                                                       setFoods={setFoods}
                                                       foods={foods}
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

export default Frigo;
