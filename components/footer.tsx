import React from 'react';
import { Car, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const usefulLinks = [
    'About Us', 'Our Services', 'Tariffs', 'Contact', 'Privacy Policy'
  ];
  
  const explore = [
    'Airport Transfer', 'City Tours', 'Business Travel', 'Event Transport', 'Corporate Services'
  ];

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <Car size={24} className="text-black" />
              </div>
              <span className="text-2xl font-bold">LuxDrive</span>
            </div>
            
            <p className="text-gray-400">
              Transport haut de gamme, service premium. 
              Votre satisfaction est notre priorité.
            </p>
            
            <div className="flex gap-4">
              <Facebook size={20} className="text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors" />
              <Twitter size={20} className="text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors" />
              <Instagram size={20} className="text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors" />
              <Linkedin size={20} className="text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors" />
            </div>
          </div>
          
          {/* Useful Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Useful Links</h3>
            <ul className="space-y-3">
              {usefulLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Explore */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Explore</h3>
            <ul className="space-y-3">
              {explore.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Have a Question? */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Have a Question?</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-yellow-400 flex-shrink-0" />
                <span className="text-gray-400">123 Rue de la Paix, Paris</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-yellow-400 flex-shrink-0" />
                <span className="text-gray-400">0744 55 58 239</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-yellow-400 flex-shrink-0" />
                <span className="text-gray-400">contact@luxdrive.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">
              © 2024 LuxDrive. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Mentions légales
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                RGPD
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;