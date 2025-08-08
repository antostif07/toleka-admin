import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-black shadow text-white">
      <div className="">
        <div className="flex justify-between h-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Image src="/images/toleka-no-bg.png" alt={"Logo"} width="160" height={160}/>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 h-full flex space-x-12 align-center justify-center items-center">
              <a href="#" className="hover:text-yellow-400">Accueil</a>
              <a href="#" className="hover:text-yellow-400">A propos</a>
              <a href="#" className="hover:text-yellow-400">Services</a>
              <a href="#" className="hover:text-yellow-400">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}