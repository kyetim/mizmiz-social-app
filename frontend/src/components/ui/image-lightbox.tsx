'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ZoomOut } from 'lucide-react'
import { useState } from 'react'

interface ImageLightboxProps {
    isOpen: boolean
    onClose: () => void
    imageUrl: string
    alt?: string
}

export function ImageLightbox({ isOpen, onClose, imageUrl, alt = 'Image' }: ImageLightboxProps) {
    const [zoom, setZoom] = useState(1)

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.25, 3))
    }

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.25, 0.5))
    }

    const handleReset = () => {
        setZoom(1)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] cursor-pointer"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                        {/* Controls */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleZoomOut}
                                className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors"
                                title="Küçült"
                            >
                                <ZoomOut className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleReset}
                                className="px-3 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors text-sm font-medium"
                                title="Sıfırla"
                            >
                                {Math.round(zoom * 100)}%
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleZoomIn}
                                className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors"
                                title="Büyüt"
                            >
                                <ZoomIn className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors"
                                title="Kapat"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="max-w-[95vw] max-h-[95vh] overflow-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.img
                                src={imageUrl}
                                alt={alt}
                                animate={{ scale: zoom }}
                                transition={{ duration: 0.2 }}
                                className="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                                style={{ transformOrigin: 'center' }}
                            />
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}


