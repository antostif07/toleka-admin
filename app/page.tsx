"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Car, Clock, MapPin, Phone, Shield, Star, Users, Download, Smartphone, CheckCircle } from "lucide-react"
import Image from "next/image"
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion"
import { useRef, useState, useEffect } from "react"

// Animation variants avec effets de scroll avancés
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.25, 0.25, 0.25, 0.75] }
}

const slideInLeft = {
  initial: { opacity: 0, x: -100, rotateY: -15 },
  animate: { opacity: 1, x: 0, rotateY: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
}

const slideInRight = {
  initial: { opacity: 0, x: 100, rotateY: 15 },
  animate: { opacity: 1, x: 0, rotateY: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
}

const scaleReveal = {
  initial: { opacity: 0, scale: 0.8, rotateX: -15 },
  animate: { opacity: 1, scale: 1, rotateX: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

const scaleOnHover = {
  hover: {
    scale: 1.05,
    rotateY: 5,
    rotateX: 5,
    transition: { duration: 0.3 }
  }
}

// Composant de révélation progressive
function RevealSection({ children, animation = fadeInUp, className = "" }: {
  children: React.ReactNode;
  animation?: any;
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-150px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={animation.initial}
      animate={isInView ? animation.animate : animation.initial}
      transition={animation.transition}
    >
      {children}
    </motion.div>
  )
}

// Composant de parallax avancé
function ParallaxElement({ children, speed = 0.5, direction = "up" }: {
  children: React.ReactNode;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const { scrollYProgress } = useScroll()

  const getTransform = () => {
    switch (direction) {
      case "up": return useTransform(scrollYProgress, [0, 1], [0, -speed * 100])
      case "down": return useTransform(scrollYProgress, [0, 1], [0, speed * 100])
      case "left": return useTransform(scrollYProgress, [0, 1], [0, -speed * 100])
      case "right": return useTransform(scrollYProgress, [0, 1], [0, speed * 100])
      default: return useTransform(scrollYProgress, [0, 1], [0, -speed * 100])
    }
  }

  const transform = getTransform()

  return (
    <motion.div
      style={direction === "left" || direction === "right" ? { x: transform } : { y: transform }}
    >
      {children}
    </motion.div>
  )
}

// Composant de compteur animé
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''))
      let start = 0
      const duration = 2000
      const increment = numericValue / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start >= numericValue) {
          setCount(numericValue)
          clearInterval(timer)
        } else {
          setCount(start)
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {value.includes('.') ? count.toFixed(1) : Math.floor(count)}{value.includes('K') ? 'K' : ''}{suffix}
    </span>
  )
}

export default function Home() {
  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const downloadRef = useRef(null)
  const driversRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" })
  // const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" })
  // const downloadInView = useInView(downloadRef, { once: true, margin: "-100px" })
  // const driversInView = useInView(driversRef, { once: true, margin: "-100px" })

  // Effets de parallax multiples
  // const heroParallax = useTransform(scrollYProgress, [0, 1], [0, -100])
  const backgroundParallax = useTransform(scrollYProgress, [0, 1], [0, -200])
  const floatingElements = useTransform(scrollYProgress, [0, 1], [0, -300])

  // Rotation et scale basés sur le scroll
  const heroRotation = useTransform(scrollYProgress, [0, 0.3], [0, 5])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="border-b border-yellow-500/20 bg-black/90 backdrop-blur-md fixed w-full z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05, rotateZ: 2 }}
              transition={{ duration: 0.2 }}
            >
              {/* <motion.div
                className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center"
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.6 }}
              >
                <Car className="h-5 w-5 text-black" />
              </motion.div> */}
              <Image
                src="/images/toleka-no-bg.png"
                alt="Toleka Logo"
                width={120}
                height={120}
              />
            </motion.div>

            <nav className="hidden md:flex items-center space-x-8">
              {["Accueil", "Fonctionnalités", "Chauffeurs", "Contact"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-white hover:text-yellow-500 transition-colors relative"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -3, scale: 1.1 }}
                >
                  {item}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500"
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </nav>

            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* <motion.div
                whileHover={{ scale: 1.05, rotateZ: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
                  Connexion
                </Button>
              </motion.div> */}
              <motion.div
                whileHover={{ scale: 1.05, rotateZ: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-yellow-500 text-black hover:bg-yellow-600">
                  Télécharger
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section avec parallax avancé */}
      <section id="accueil" className="pt-24 pb-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        {/* Background animé */}
        <motion.div
          style={{ y: backgroundParallax }}
          className="absolute inset-0 opacity-30"
        >
          <div className="absolute top-20 left-10 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-40 left-1/4 w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse delay-700"></div>
          <div className="absolute top-60 right-1/3 w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse delay-1000"></div>
        </motion.div>

        {/* Éléments flottants */}
        <motion.div
          style={{ y: floatingElements }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-32 left-20 w-20 h-20 border border-yellow-500/20 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-32 right-20 w-16 h-16 border border-yellow-500/10 rounded-full animate-pulse"></div>
        </motion.div>

        <div className="container mx-auto px-4" ref={heroRef}>
          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center"
            style={{
              rotateX: heroRotation,
              scale: heroScale
            }}
          >
            <RevealSection animation={slideInLeft} className="space-y-8">
              <motion.div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateZ: -5 }}
                  animate={heroInView ? { opacity: 1, scale: 1, rotateZ: 0 } : { opacity: 0, scale: 0.8, rotateZ: -5 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
                    🚗 Votre nouveau compagnon de route
                  </Badge>
                </motion.div>

                <motion.h1
                  className="text-5xl lg:text-6xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 50, rotateX: -15 }}
                  animate={heroInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: -15 }}
                  transition={{ duration: 1, delay: 0.4 }}
                >
                  Voyagez avec
                  <motion.span
                    className="text-yellow-500 inline-block"
                    initial={{ opacity: 0, rotateY: -90 }}
                    animate={heroInView ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: -90 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  > Toleka</motion.span>
                </motion.h1>

                <motion.p
                  className="text-xl text-gray-300 leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Commandez votre course en quelques secondes. Rapide, sûr, et accessible partout dans votre ville.
                </motion.p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 40 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-600 text-lg px-8 py-4 shadow-lg">
                    <Download className="mr-2 h-5 w-5" />
                    Téléchargez maintenant
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, rotateX: -5, rotateY: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black text-lg px-8 py-4 shadow-lg">
                    Devenir chauffeur
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex items-center space-x-8 pt-4"
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
              >
                {[
                  { value: "50K+", label: "Utilisateurs actifs" },
                  { value: "4.8", label: "Note moyenne" },
                  { value: "24/7", label: "Service disponible" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                    animate={heroInView ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0, scale: 0.5, rotateY: -90 }}
                    transition={{ duration: 0.8, delay: 1.4 + index * 0.2 }}
                    whileHover={{ scale: 1.1, rotateY: 10 }}
                  >
                    <div className="text-2xl font-bold text-yellow-500">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </RevealSection>

            <RevealSection animation={slideInRight} className="relative">
              <ParallaxElement speed={0.3} direction="up">
                <motion.div
                  className="relative z-10"
                  whileHover={{
                    scale: 1.02,
                    rotateY: 5,
                    rotateX: 5
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="https://whitelabelfox.com/assets/images/uber-clone-app/taxi-ride-service-section.webp"
                    alt="Interface de l'app Toleka"
                    width={600}
                    height={500}
                    className="rounded-2xl shadow-2xl"
                  />
                </motion.div>
              </ParallaxElement>

              <motion.div
                className="absolute inset-0 bg-yellow-500/20 rounded-2xl blur-2xl transform scale-110"
                animate={{
                  scale: [1.1, 1.3, 1.1],
                  opacity: [0.2, 0.4, 0.2],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </RevealSection>
          </motion.div>
        </div>
      </section>

      {/* Features Section avec effets 3D */}
      <section id="fonctionnalites" className="py-20 bg-gray-900 relative overflow-hidden" ref={featuresRef}>
        {/* Background géométrique animé */}
        <ParallaxElement speed={0.2} direction="right">
          <div className="absolute top-20 left-0 w-64 h-64 border border-yellow-500/10 rounded-full transform rotate-45"></div>
        </ParallaxElement>
        <ParallaxElement speed={0.4} direction="left">
          <div className="absolute bottom-20 right-0 w-48 h-48 border border-yellow-500/5 rounded-full"></div>
        </ParallaxElement>

        <div className="container mx-auto px-4 relative z-10">
          <RevealSection animation={scaleReveal} className="text-center mb-16">
            <motion.h2
              className="text-4xl font-bold mb-4"
              whileInView={{
                backgroundImage: "linear-gradient(45deg, #ffffff, #eab308)",
                backgroundClip: "text",
                color: "transparent"
              }}
              style={{
                WebkitBackgroundClip: "text"
              }}
              transition={{ duration: 1 }}
            >
              Pourquoi choisir <span className="text-yellow-500">Toleka</span> ?
            </motion.h2>
            <motion.p
              className="text-xl text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Une expérience de transport révolutionnaire avec des fonctionnalités pensées pour votre confort et votre sécurité.
            </motion.p>
          </RevealSection>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { icon: Clock, title: "Réservation instantanée", desc: "Commandez votre course en moins de 30 secondes. Pas d'attente, pas de complications.", color: "from-blue-500 to-purple-500" },
              { icon: MapPin, title: "Suivi en temps réel", desc: "Suivez votre chauffeur en temps réel et connaissez l'heure d'arrivée précise.", color: "from-green-500 to-teal-500" },
              { icon: Shield, title: "Sécurité maximale", desc: "Tous nos chauffeurs sont vérifiés et nos véhicules contrôlés régulièrement.", color: "from-red-500 to-pink-500" },
              { icon: Star, title: "Service premium", desc: "Des véhicules confortables et des chauffeurs professionnels pour votre confort.", color: "from-yellow-500 to-orange-500" },
              { icon: Phone, title: "Support 24/7", desc: "Notre équipe de support est disponible 24h/24 pour vous assister.", color: "from-indigo-500 to-blue-500" },
              { icon: Users, title: "Communauté active", desc: "Rejoignez des milliers d'utilisateurs satisfaits dans votre région.", color: "from-purple-500 to-pink-500" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 100,
                  rotateX: -30,
                  rotateY: index % 2 === 0 ? -15 : 15
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  rotateY: 0
                }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 10,
                  rotateX: 5,
                  z: 50
                }}
                className="transform-gpu"
              >
                <Card className="bg-black border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 h-full backdrop-blur-sm relative overflow-hidden group">
                  {/* Gradient background qui apparaît au hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  <CardHeader className="relative z-10">
                    <motion.div
                      className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden"
                      whileHover={{
                        backgroundColor: "rgba(234, 179, 8, 0.4)",
                        scale: 1.1,
                        rotateZ: 360
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="h-6 w-6 text-yellow-500 relative z-10" />
                      <motion.div
                        className="absolute inset-0 bg-yellow-500/20 rounded-lg"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                    <CardTitle className="text-white group-hover:text-yellow-500 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {feature.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Download Section avec masking effects */}
      <section className="py-20 bg-black relative overflow-hidden" ref={downloadRef}>
        {/* Masking overlay animé */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent"
          initial={{ x: "-100%" }}
          whileInView={{ x: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <RevealSection animation={fadeInUp} className="text-center mb-16">
            <motion.h2
              className="text-4xl font-bold mb-4"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              Téléchargez <span className="text-yellow-500">Toleka</span> maintenant
            </motion.h2>
            <motion.p
              className="text-xl text-gray-400 max-w-2xl mx-auto"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            >
              Disponible gratuitement sur iOS et Android. Commencez à voyager différemment dès aujourd'hui.
            </motion.p>
          </RevealSection>

          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <RevealSection animation={slideInLeft} className="space-y-8">
              <motion.div className="space-y-6">
                {[
                  "Application gratuite et sans engagement",
                  "Compatible iOS et Android",
                  "Interface intuitive et moderne",
                  "Paiement sécurisé intégré"
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4 group"
                    initial={{ opacity: 0, x: -50, rotateY: -15 }}
                    whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ x: 15, scale: 1.05 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotateZ: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                    </motion.div>
                    <span className="text-lg group-hover:text-yellow-500 transition-colors duration-300">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {["App Store", "Google Play"].map((store, index) => (
                  <motion.div
                    key={store}
                    whileHover={{
                      scale: 1.05,
                      rotateX: 5,
                      rotateY: index === 0 ? 5 : -5
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, rotateX: -30 }}
                    whileInView={{ opacity: 1, rotateX: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  >
                    <Button size="lg" className="bg-black border border-white text-white hover:bg-white hover:text-black flex items-center shadow-lg hover:shadow-yellow-500/20">
                      <Smartphone className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <div className="text-xs">{index === 0 ? "Télécharger sur" : "Disponible sur"}</div>
                        <div className="text-sm font-semibold">{store}</div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </RevealSection>

            <RevealSection animation={slideInRight}>
              <ParallaxElement speed={0.2} direction="down">
                <motion.div
                  whileHover={{
                    scale: 1.02,
                    rotateY: -5,
                    rotateX: 5
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Image
                    src="https://elements-resized.envatousercontent.com/elements-cover-images/44fce2a7-90d4-4ede-bac2-d9f45bc9b548?w=433&cf_fit=scale-down&q=85&format=auto&s=18fd9cbbb2ebb150a4ef86dcb5992a50439627eab682173dc568c365590fdb89"
                    alt="Mockups de l'application Toleka"
                    width={500}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-transparent rounded-2xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                  />
                </motion.div>
              </ParallaxElement>
            </RevealSection>
          </motion.div>
        </div>
      </section>

      {/* Driver Section avec transformation 3D */}
      <section id="chauffeurs" className="py-20 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black relative overflow-hidden" ref={driversRef}>
        {/* Éléments géométriques animés */}
        <ParallaxElement speed={0.3} direction="left">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-black/10 rounded-full"></div>
        </ParallaxElement>
        <ParallaxElement speed={0.5} direction="right">
          <div className="absolute bottom-10 right-10 w-24 h-24 border border-black/5 transform rotate-45"></div>
        </ParallaxElement>

        <div className="container mx-auto px-4 relative z-10">
          <RevealSection animation={scaleReveal} className="text-center mb-16">
            <motion.h2
              className="text-4xl font-bold mb-4"
              initial={{ rotateX: -90, opacity: 0 }}
              whileInView={{ rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Devenez chauffeur <span className="text-gray-800">Toleka</span>
            </motion.h2>
            <motion.p
              className="text-xl max-w-2xl mx-auto opacity-90"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 0.9 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Générez des revenus en conduisant avec Toleka. Rejoignez notre équipe de chauffeurs professionnels.
            </motion.p>
          </RevealSection>

          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <RevealSection animation={slideInLeft} className="space-y-8">
              <motion.div
                className="space-y-6"
                initial={{ rotateY: -15 }}
                whileInView={{ rotateY: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-2xl font-semibold">Pourquoi conduire avec nous ?</h3>

                <motion.div className="space-y-4">
                  {[
                    { title: "Revenus attractifs", desc: "Gagnez jusqu'à 80% du montant de chaque course" },
                    { title: "Flexibilité totale", desc: "Travaillez quand vous voulez, où vous voulez" },
                    { title: "Support dédié", desc: "Une équipe dédiée pour vous accompagner" },
                    { title: "Paiement rapide", desc: "Recevez vos gains chaque semaine" }
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-4 group"
                      initial={{ opacity: 0, x: -30, rotateX: -15 }}
                      whileInView={{ opacity: 1, x: 0, rotateX: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ x: 15, scale: 1.02 }}
                    >
                      <motion.div
                        className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0"
                        whileHover={{ scale: 1.2, rotateZ: 360 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="h-5 w-5 text-yellow-500" />
                      </motion.div>
                      <div className="group-hover:transform group-hover:translateX-2 transition-transform duration-300">
                        <h4 className="font-semibold">{benefit.title}</h4>
                        <p className="opacity-90">{benefit.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              <RevealSection animation={fadeInUp}>
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">Conditions requises</h3>
                  <motion.ul
                    className="space-y-2 opacity-90"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.9 }}
                    transition={{ duration: 0.8 }}
                  >
                    <li>• Permis de conduire valide depuis plus de 3 ans</li>
                    <li>• Véhicule en bon état (moins de 10 ans)</li>
                    <li>• Assurance commerciale</li>
                    <li>• Casier judiciaire vierge</li>
                  </motion.ul>
                </div>

                <motion.div
                  whileHover={{
                    scale: 1.05,
                    rotateX: 5,
                    rotateY: 5
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="bg-black text-yellow-500 hover:bg-gray-800 text-lg px-8 py-4 shadow-lg">
                    <Car className="mr-2 h-5 w-5" />
                    Inscription chauffeur
                  </Button>
                </motion.div>
              </RevealSection>
            </RevealSection>

            <RevealSection animation={slideInRight}>
              <motion.div
                className="bg-black/10 rounded-2xl p-8 backdrop-blur-sm"
                whileHover={{
                  scale: 1.02,
                  rotateY: -5,
                  rotateX: 5
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.h3
                  className="text-2xl font-semibold mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Inscription rapide
                </motion.h3>
                <form className="space-y-4">
                  {[
                    { label: "Nom complet", placeholder: "Votre nom complet", type: "text" },
                    { label: "Email", placeholder: "votre@email.com", type: "email" },
                    { label: "Téléphone", placeholder: "+33 6 XX XX XX XX", type: "tel" },
                    { label: "Ville", placeholder: "Votre ville", type: "text" }
                  ].map((field, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20, rotateY: -15 }}
                      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <label className="block text-sm font-medium mb-2">{field.label}</label>
                      <motion.input
                        type={field.type}
                        className="w-full px-4 py-3 rounded-lg border border-black/20 bg-white/90 text-black transition-all duration-300"
                        placeholder={field.placeholder}
                        whileFocus={{
                          scale: 1.02,
                          borderColor: "#000",
                          boxShadow: "0 0 20px rgba(234, 179, 8, 0.3)"
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                  ))}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <Button className="w-full bg-black text-yellow-500 hover:bg-gray-800 text-lg py-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      Commencer l'inscription
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            </RevealSection>
          </motion.div>
        </div>
      </section>

      {/* Footer avec reveal progressif */}
      <motion.footer
        id="contact"
        className="py-16 bg-black border-t border-yellow-500/20 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Background pattern animé */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, yellow 1px, transparent 0)",
            backgroundSize: "20px 20px"
          }}
          animate={{ backgroundPosition: ["0px 0px", "20px 20px"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="grid md:grid-cols-4 gap-8 mb-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <RevealSection animation={fadeInUp}>
              <div className="space-y-4">
                <motion.div
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center"
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Car className="h-5 w-5 text-black" />
                  </motion.div>
                  <span className="text-2xl font-bold text-yellow-500">Toleka</span>
                </motion.div>
                <p className="text-gray-400">
                  L'application de VTC nouvelle génération. Voyagez différemment, voyagez avec Toleka.
                </p>
              </div>
            </RevealSection>

            {[
              {
                title: "Liens rapides",
                links: ["Accueil", "Fonctionnalités", "Devenir chauffeur", "Aide"]
              },
              {
                title: "Légal",
                links: ["Conditions d'utilisation", "Politique de confidentialité", "Mentions légales", "CGV"]
              },
              {
                title: "Contact",
                links: ["support@toleka.com", "+33 1 XX XX XX XX", "Paris, France"]
              }
            ].map((section, index) => (
              <RevealSection key={index} animation={fadeInUp}>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">{section.title}</h4>
                  <ul className="space-y-2 text-gray-400">
                    {section.links.map((link, linkIndex) => (
                      <motion.li
                        key={linkIndex}
                        whileHover={{
                          x: 10,
                          color: "#eab308",
                          scale: 1.05
                        }}
                        transition={{ duration: 0.2 }}
                        className="cursor-pointer"
                      >
                        <a href="#" className="hover:text-yellow-500 transition-colors">{link}</a>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </RevealSection>
            ))}
          </motion.div>

          <motion.div
            className="border-t border-yellow-500/20 pt-8 text-center text-gray-400"
            initial={{ opacity: 0, y: 20, clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p>&copy; {new Date().getFullYear()} Toleka. Tous droits réservés.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}