import Image from "next/image";

import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import usersAvatarExampleImg from "../assets/users-avatar-example.png";
import IconCheckImg from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolsCount: number;
  guessesCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert(
        "Bolão criado com sucesso! O código foi copiado para a área de transferencica."
      );

      setPoolTitle("");
    } catch (err) {
      console.log(err);
      alert("Falha ao criar bolão. Tente novamente.");
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoImg} alt="Nlw Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="" />

          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500 ">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            name=""
            required
            id=""
            placeholder="Qual nome do seu bolão?"
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={IconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolsCount}</span>
              <span>Boloes comprados</span>
            </div>
          </div>
          <div className="w-px h-15 bg-gray-700"></div>
          <div className="flex items-center gap-6">
            <Image src={IconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessesCount}</span>
              <span>Palpites Enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia da aplicação movel do Nlw Copa"
      />
    </div>

    //<h1 className="text-">Contagem: {props.poolsCount}</h1>
  );
}

/*
export const getServerSideProps = async () => {
  const [poolCountResponse, guessesCountResponse, userCountResponse] =
    await Promise.all([
      api.get("/pools/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);

    console.log("OIII")

  return {
    props: {
      poolsCount: poolCountResponse.data.count,
      guessesCount: guessesCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
};*/

export async function loadCounts() {
  const [poolCountResponse, guessesCountResponse, userCountResponse] =
    await Promise.all([
      api.get("/pools/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);

  return {
    poolsCount: poolCountResponse.data.count,
    guessesCount: guessesCountResponse.data.count,
    userCount: userCountResponse.data.count,
  };
}

export const getStaticProps = async () => {

  const counts = await loadCounts();

  return {
    props: {
      poolsCount: counts.poolsCount,
      guessesCount: counts.guessesCount,
      userCount: counts.userCount,
    },
    revalidate: 30,
  };
};
