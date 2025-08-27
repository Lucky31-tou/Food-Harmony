import { usePage } from "./Context";
import logo from "./images/logo.jpg";

function Accueil() {
     const { setPage } = usePage();

     return (
          <div
               className="hero bg-base-200"
               style={{ height: "calc(100vh - 130px)" }}
          >
               <div className="hero-content text-center">
                    <div className="max-w-md">
                         <div className="flex justify-center items-baseline gap-4 mb-8">
                              <h1 className="text-5xl font-bold">
                                   Bienvenue sur
                                   <span className="inline-block">
                                        Food Harmony
                                   </span>
                              </h1>
                              <img
                                   src={logo}
                                   alt="Logo"
                                   className="w-25 h-25 mr-2 rounded-field self-center"
                              />
                         </div>
                         <p className="py-6">Votre frigo dans votre poche</p>
                    </div>
                    <div>
                         <button className="btn btn-primary mx-2">
                              Proposer une liste de courses
                         </button>
                         <button
                              className="btn btn-primary mx-2"
                              onClick={() => {
                                   setPage(2);
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
