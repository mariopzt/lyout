import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './hero.css';

const heroImages = [
  "https://images.pexels.com/photos/2331884/pexels-photo-2331884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/3820514/pexels-photo-3820514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/12584752/pexels-photo-12584752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/30557566/pexels-photo-30557566/free-photo-of-elegante-exposicion-de-vinos-en-pauillac-francia.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/29850609/pexels-photo-29850609/free-photo-of-botella-de-vinos.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/15745876/pexels-photo-15745876/free-photo-of-alcohol-botellas-vaso-cristal.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/28989792/pexels-photo-28989792/free-photo-of-exhibicion-de-la-coleccion-de-vinos-blancos-y-negros.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
];

const Hero = ({ onTabChange }) => {
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % heroImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-advanced">
      <h1 className="hero-title">Miga</h1>
      <p className="hero-desc">Un espacio moderno donde la creatividad y la tradición se fusionan para ofrecerte una experiencia culinaria única. Descubre sabores auténticos, ingredientes frescos y un ambiente acogedor.</p>
      <button className="item-card-edit-button verLista" onClick={() => onTabChange('list')}>Ver lista ...</button>
    </section>
  );
};

export default Hero;
