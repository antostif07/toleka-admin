import React from 'react';
import { ArrowRight, } from 'lucide-react';
import { Button } from './ui/button';
import Navbar from './navbar';
import Image from 'next/image';

const Hero = () => {
  return (
    <>
        <Navbar />
        <section className="relative max-w-screen-xl mx-auto px-4 py-16">
            <div className="">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <div className="relative">
                    {/* <div className='absolute top-0 bottom-0 right-0 left-0 bg-yellow-400 rounded-[50px] -rotate-[34deg]'></div> */}
                    <div className='space-y-8 relative'>
                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                        Commandez Votre <span className="text-yellow-400">Voiture</span> Partout, et
                        <span className="text-yellow-400">Quand Vous Voulez</span>
                        </h1>
                        
                        <p className="text-xl text-gray-600 max-w-lg">
                        {`Toleka est l'application de VTC nouvelle génération qui vous permet de commander une voiture de luxe en quelques clics. Profitez d'une expérience de conduite exceptionnelle avec des chauffeurs professionnels et des véhicules haut de gamme.`}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button variant="secondary" size="lg">
                                {`Telecharger l'App`} <ArrowRight className="ml-2" />
                            </Button>
                        </div>
                    
                    </div>
                </div>
                
                {/* Image */}
                <div className="relative">
                    <Image
                    width={600}
                    height={400}
                    src="/images/toleka-car.webp"
                    alt="Voiture de luxe blanche"
                    className="relative z-10 w-full h-auto"
                    />
                </div>
                </div>
            </div>
            </section>
    </>
  );
};

export default Hero;