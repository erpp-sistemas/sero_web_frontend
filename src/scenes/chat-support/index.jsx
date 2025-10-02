import { useState } from "react";
import { getIcon } from "../../data/Icons";

const Index = () => {
    const sections = [
        { id: "support", name: "Soporte técnico", url: "https://interfaces.zapier.com/embed/chatbot/cmg2ikk27000mxkhfn8syhnon" },
        { id: "sales", name: "Administración", url: "https://interfaces.zapier.com/embed/chatbot/cmg2ikk27000mxkhfn8syhnon" },
        { id: "finance", name: "Finanzas", url: "https://interfaces.zapier.com/embed/chatbot/cmg2ikk27000mxkhfn8syhnon" },
    ];

    // sección actual
    const [active, setActive] = useState(sections[0]);

    return (

        <>
            <h1 className="text-2xl font-extrabold px-16 text-[#99FF99] mt-2">
                Soporte y Asistencia
            </h1>
            <h3 className="text-sm px-16">Aquí podrás generar consultas sobre adeudos, pagos, gestiones y resolver dudas técnicas sobre nuestras plataformas</h3>
            <div className="relative flex items-center justify-center mt-4">
                {/* Contenedor principal */}
                <div className="relative w-4/5 h-[70vh] rounded-xl shadow-2xl overflow-hidden border border-[#46695B] flex z-10">

                    {/* Sidebar izquierda */}
                    <div className="w-1/4 bg-[#1f2937] border-r border-[#46695B] flex flex-col">
                        <div className="flex items-center gap-2 bg-[#8d908f] px-4 py-3">
                            {getIcon("SmartToyIcon", { color: "white", fontSize: 28 })}
                            <h2 className="text-white font-semibold">Asistente IA</h2>
                        </div>

                        <div className="flex-1 p-4 space-y-3">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActive(section)}
                                    className={`w-full text-left px-4 py-4 rounded-lg transition-colors ${active.id === section.id
                                        ? "bg-[#43e9a7] text-gray-800 font-semibold"
                                        : "bg-[#293647] text-gray-300 hover:bg-[#3a4a5b]"
                                        }`}
                                >
                                    {section.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/*chat */}
                    <div className="flex-1 p-6 flex flex-col">
                        <div className="flex justify-start items-center mb-4">
                            {/* LED verde animado */}
                            <div className="relative flex px-6 items-center">
                                <div className="w-4 h-4 rounded-full bg-green-400 animate-ping absolute"></div>
                                <div className="w-4 h-4 rounded-full bg-green-500 relative"></div>
                            </div>
                            <p className="text-gray-300 text-base">
                                Estás chateando con el área de <span className="text-[#99FF99] font-medium">{active.name}</span>.
                            </p>
                        </div>
                        <div className="flex-1 rounded-xl overflow-hidden shadow-inner border border-[#46695B]">
                            <iframe
                                src={active.url}
                                width="100%"
                                height="100%"
                                allow="clipboard-write *"
                                style={{ border: "none" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Index;
