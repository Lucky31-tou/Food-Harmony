import { Search } from "lucide-react";
import logo from "./images/logo.jpg";
import { PageContext, usePage } from "./Context";

function Navbar() {
     const { setPage } = usePage();

     return (
          <div className="navbar bg-base-100 py-4">
               <div className="navbar-start">
                    <button
                         className="btn btn-ghost text-5xl h-24 px-6"
                         onClick={() => setPage(0)}
                    >
                         <img
                              src={logo}
                              alt="Logo"
                              className="w-20 h-20 mr-2 rounded-field"
                         />
                         Food Harmony
                    </button>
               </div>
               <div className="navbar-center">
                    <ul className="menu menu-lg menu-horizontal px-1">
                         <li>
                              <button
                                   className="text-2xl"
                                   onClick={() => setPage(0)}
                              >
                                   Accueil
                              </button>
                         </li>
                         <li>
                              <button
                                   className="text-2xl"
                                   onClick={() => setPage(1)}
                              >
                                   Consulter votre frigo
                              </button>
                         </li>
                         <li>
                              <button
                                   className="text-2xl"
                                   onClick={() => setPage(2)}
                              >
                                   Consulter vos menus
                              </button>
                         </li>
                    </ul>
               </div>
               <div className="navbar-end">
                    <div className="input-group relative">
                         <label className="input input-lg input-bordered w-24 md:w-auto text-2xl pr-16">
                              <input
                                   type="text"
                                   placeholder="Rechercher"
                                   className="grow"
                              />
                              <button className="btn btn-lg btn-ghost btn-square p-2 absolute right-0 top-0 bottom-0">
                                   <Search size={40} />
                              </button>
                         </label>
                    </div>
                    <div className="dropdown dropdown-end ml-4">
                         <label
                              tabIndex="0"
                              className="btn btn-ghost btn-circle avatar"
                         >
                              <svg
                                   xmlns="http://www.w3.org/2000/svg"
                                   width="64"
                                   height="64"
                                   viewBox="0 0 24 24"
                                   fill="none"
                                   stroke="currentColor"
                                   strokeWidth="2"
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                              >
                                   <line x1="3" y1="6" x2="21" y2="6" />
                                   <line x1="3" y1="12" x2="21" y2="12" />
                                   <line x1="3" y1="18" x2="21" y2="18" />
                              </svg>
                         </label>
                         <ul
                              className="menu menu-lg dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                              tabIndex="0"
                         >
                              <li>
                                   <button className="text-2xl">Profil</button>
                              </li>
                              <li>
                                   <button className="text-2xl">
                                        Paramètres
                                   </button>
                              </li>
                              <li>
                                   <button className="text-2xl">
                                        Déconnexion
                                   </button>
                              </li>
                         </ul>
                    </div>
               </div>
          </div>
     );
}

export default Navbar;
