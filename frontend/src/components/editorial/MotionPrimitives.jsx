import React, { useState } from "react"
import { motion } from "framer-motion"
import { getFallbackImage, handleImageError } from "@/lib/imageFallback"

export const EDITORIAL_EASE = [0.22, 1, 0.36, 1]

export const PageTransition = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, ease: EDITORIAL_EASE }}
    className={className}
  >
    {children}
  </motion.div>
)

export const RevealSection = ({
  children,
  className = "",
  delay = 0,
  y = 18,
}) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.55, delay, ease: EDITORIAL_EASE }}
    className={className}
  >
    {children}
  </motion.div>
)

export const StaggerGrid = ({ children, className = "" }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.08 }}
    variants={{
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.08,
        },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
)

export const StaggerItem = ({ children, className = "" }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 16 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: EDITORIAL_EASE },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
)

export const EditorialImage = ({
  src,
  alt,
  categorySlug = "blog",
  className = "",
  containerClassName = "",
  loading = "lazy",
  dark = false,
}) => {
  const [loaded, setLoaded] = useState(false)
  const resolvedSrc = src || getFallbackImage(categorySlug)

  return (
    <div
      className={`relative overflow-hidden ${
        dark ? "bg-soft-black" : "bg-stone/40"
      } ${containerClassName}`}
    >
      {!loaded && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 animate-pulse ${
            dark ? "bg-soft-black" : "bg-stone/60"
          }`}
        />
      )}
      <img
        src={resolvedSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          handleImageError(e, categorySlug)
          setLoaded(true)
        }}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
        } ${className}`}
      />
    </div>
  )
}
