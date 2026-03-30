import { useState } from "react";
import { useTracker } from "../context/TrackerContext";
import foods from "../data/foods";

const REFEICOES = ["Café da manhã", "Almoço", "Lanche da tarde", "Jantar"];

function Hoje() {
  const { state, dispatch } = useTracker();
  const [refeicaoAtiva, setRefeicaoAtiva] = useState("Café da manhã");
  const [busca, setBusca] = useState("");
  const [alimentoSelecionado, setAlimentoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(100);

  const hoje = new Date().toISOString().split("T")[0];
  const logHoje = state.logs[hoje] || {
    "Café da manhã": [],
    Almoço: [],
    "Lanche da tarde": [],
    Jantar: [],
  };

  const totais = Object.values(logHoje)
    .flat()
    .reduce(
      (a, i) => ({
        cal: a.cal + i.cal,
        p: a.p + i.p,
        c: a.c + i.c,
        f: a.f + i.f,
      }),
      { cal: 0, p: 0, c: 0, f: 0 }
    );

  const alimentosFiltrados =
    busca.trim() === ""
      ? foods
      : foods.filter((f) =>
          f.name.toLowerCase().includes(busca.toLowerCase())
        );

  function selecionarAlimento(alimento) {
    setAlimentoSelecionado(alimento);
    setQuantidade(100);
  }

  function adicionarAlimento() {
    if (!alimentoSelecionado) return;

    const ratio = quantidade / 100;

    dispatch({
      type: "ADD_FOOD",
      meal: refeicaoAtiva,
      item: {
        id: Date.now(),
        name: alimentoSelecionado.name,
        qty: quantidade,
        cal: Math.round(alimentoSelecionado.cal * ratio),
        p: Math.round(alimentoSelecionado.p * ratio * 10) / 10,
        c: Math.round(alimentoSelecionado.c * ratio * 10) / 10,
        f: Math.round(alimentoSelecionado.f * ratio * 10) / 10,
      },
    });

    setAlimentoSelecionado(null);
    setBusca("");
  }

  function removerAlimento(id) {
    dispatch({ type: "REMOVE_FOOD", meal: refeicaoAtiva, id });
  }

  const { goals } = state;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="grid grid-cols-5 gap-2 mb-4">
        {[
          {
            lbl: "Calorias",
            val: Math.round(totais.cal),
            meta: goals.cal,
            unit: "kcal",
          },
          {
            lbl: "Proteína",
            val: Math.round(totais.p),
            meta: goals.p,
            unit: "g",
          },
          {
            lbl: "Carbs",
            val: Math.round(totais.c),
            meta: goals.c,
            unit: "g",
          },
          {
            lbl: "Gordura",
            val: Math.round(totais.f),
            meta: goals.f,
            unit: "g",
          },
          {
            lbl: "Água",
            val: state.waterLog[hoje] || 0,
            meta: goals.water,
            unit: "ml",
          },
        ].map((item) => (
          <div
            key={item.lbl}
            className="bg-white rounded-xl border border-gray-100 p-3 text-center"
          >
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              {item.lbl}
            </p>
            <p className="text-lg font-medium text-gray-800">
              {item.val}
              <span className="text-xs text-gray-400 ml-1">{item.unit}</span>
            </p>
            <div className="h-1 bg-gray-100 rounded-full mt-2">
              <div
                className="h-1 bg-violet-400 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    item.meta > 0 ? Math.round((item.val / item.meta) * 100) : 0
                  )}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Consumo de água
        </p>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: Math.ceil(goals.water / goals.cupMl) }).map(
            (_, i) => {
              const cheio =
                i < Math.round((state.waterLog[hoje] || 0) / goals.cupMl);

              return (
                <button
                  key={i}
                  onClick={() =>
                    dispatch({
                      type: "SET_WATER",
                      amount: (cheio ? i : i + 1) * goals.cupMl,
                    })
                  }
                  className={`w-9 h-9 rounded-lg border text-xs font-medium transition-all ${
                    cheio
                      ? "bg-blue-100 border-blue-400 text-blue-700"
                      : "border-gray-200 text-gray-400"
                  }`}
                >
                  {i + 1}
                </button>
              );
            }
          )}
          <span className="text-sm text-gray-400 self-center ml-2">
            {state.waterLog[hoje] || 0} / {goals.water} ml
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex gap-2 flex-wrap mb-4">
          {REFEICOES.map((r) => (
            <button
              key={r}
              onClick={() => {
                setRefeicaoAtiva(r);
                setAlimentoSelecionado(null);
                setBusca("");
              }}
              className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                refeicaoAtiva === r
                  ? "bg-gray-800 text-white border-gray-800"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <p className="text-sm font-medium text-gray-700 mb-3">
          {refeicaoAtiva}
        </p>

        <input
          type="text"
          placeholder="Buscar alimento (ex: frango, arroz, banana)..."
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setAlimentoSelecionado(null);
          }}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none focus:border-gray-400 mb-2"
        />

        <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-lg mb-3">
          {alimentosFiltrados.map((f) => (
            <div
              key={f.id}
              onClick={() => selecionarAlimento(f)}
              className={`flex items-center justify-between px-3 py-2 cursor-pointer border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-all ${
                alimentoSelecionado?.id === f.id ? "bg-violet-50" : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{f.name}</p>
                <p className="text-xs text-gray-400">
                  {f.cal} kcal · {f.p}g P · {f.c}g C · {f.f}g G{" "}
                  <span>(por 100g)</span>
                </p>
              </div>
              <span className="text-gray-300 text-lg">+</span>
            </div>
          ))}
        </div>

        {alimentoSelecionado && (
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 mb-3">
            <span className="text-sm text-gray-700 flex-1">
              {alimentoSelecionado.name}
            </span>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none text-center"
            />
            <span className="text-sm text-gray-400">g</span>
            <button
              onClick={adicionarAlimento}
              className="bg-gray-800 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-gray-700"
            >
              Adicionar
            </button>
          </div>
        )}

        {logHoje[refeicaoAtiva]?.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
              Adicionado em {refeicaoAtiva}
            </p>
            {logHoje[refeicaoAtiva].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 mb-1"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {item.name} — {item.qty}g
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.cal} kcal · {item.p}g P · {item.c}g C · {item.f}g G
                  </p>
                </div>
                <button
                  onClick={() => removerAlimento(item.id)}
                  className="text-gray-300 hover:text-red-400 text-lg px-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Hoje;