'use client'

import { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

declare global {
  interface Window {
    google: any
  }
}

interface GoogleMapProps {
  latitude: number
  longitude: number
  zoom?: number
}

export function GoogleMap({ latitude, longitude, zoom = 15 }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly'
      })

      try {
        const google = await loader.load()
        const position = { lat: latitude, lng: longitude }

        const map = new google.maps.Map(mapRef.current!, {
          center: position,
          zoom: zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        })

        // 마커 생성 수정
        new google.maps.Marker({
          position,
          map,
          title: 'Hospital Location'
        })

      } catch (error) {
        console.error('Error loading Google Maps:', error)
      }
    }

    if (mapRef.current) {
      initMap()
    }
  }, [latitude, longitude, zoom])

  return <div ref={mapRef} className="w-full h-[400px] rounded-lg overflow-hidden" />
} 