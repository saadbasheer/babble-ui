export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center bg-[#2F4858]">
      <div className="text-white top-0 mt-10 text-[30px] absolute italic z-2">Babble</div>
      <div className="w-[1550px] h-[750px] rounded-lg border border-white/30 z-1 absolute"></div>
      <div className="absolute flex gap-4 z-3 bottom-0 mb-20 ">
        <button className="w-[65px] h-[65px] rounded-full bg-[#2F4858] border border-black text-[#FFB684] flex items-center justify-center hover:bg-[#FFB684] hover:text-[#2F4858]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M176,160a39.89,39.89,0,0,0-28.62,12.09l-46.1-29.63a39.8,39.8,0,0,0,0-28.92l46.1-29.63a40,40,0,1,0-8.66-13.45l-46.1,29.63a40,40,0,1,0,0,55.82l46.1,29.63A40,40,0,1,0,176,160Zm0-128a24,24,0,1,1-24,24A24,24,0,0,1,176,32ZM64,152a24,24,0,1,1,24-24A24,24,0,0,1,64,152Zm112,72a24,24,0,1,1,24-24A24,24,0,0,1,176,224Z"></path>
          </svg>
        </button>
        <button className="w-[65px] h-[65px]  rounded-full bg-[#2F4858] border border-black text-[#FFB684] flex items-center justify-center hover:bg-[#FFB684] hover:text-[#2F4858]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M56,96v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0ZM88,24a8,8,0,0,0-8,8V224a8,8,0,0,0,16,0V32A8,8,0,0,0,88,24Zm40,32a8,8,0,0,0-8,8V192a8,8,0,0,0,16,0V64A8,8,0,0,0,128,56Zm40,32a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V96A8,8,0,0,0,168,88Zm40-16a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V80A8,8,0,0,0,208,72Z"></path>
          </svg>
        </button>
      </div>
      <a
        href="/start"
        className="relative w-[250px] h-[250px] rounded-full bg-[#2F4858] border border-[#FFB684] text-[#FFB684] text-3xl flex items-center justify-center transition-shadow duration-300 shadow-[0_0_40px_#FFB684] overflow-hidden group"
      >
        Babble
        <span className="absolute w-[250px] h-[250px] rounded-full border border-[#FFB684] scale-100 group-hover:scale-[0.85] transition-transform duration-500 ease-out"></span>
        <span className="absolute w-[250px] h-[250px] rounded-full border border-[#FFB684] scale-100 group-hover:scale-[0.7] transition-transform duration-700 ease-out"></span>
      </a>
    </main>
  );
}
