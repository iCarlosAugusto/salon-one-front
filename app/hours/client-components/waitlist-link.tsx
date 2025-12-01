"use client";

export function WaitlistLink() {
  return (
    <div className="rounded-xl bg-slate-50 p-4 text-center">
      <p className="text-sm text-slate-600">
        Não encontra um horário conveniente?{" "}
        <button className="font-medium text-indigo-600 hover:text-indigo-700">
          Entrar na lista de espera
        </button>
      </p>
    </div>
  );
}

