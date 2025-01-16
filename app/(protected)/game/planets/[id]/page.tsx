'use client'
import * as React from 'react'
import { Planet } from '@/components/planet/planet'; 

type Props = {
    params: Promise<{
        id: string
    }>
}

export default function PlanetPage({ params }: Props) {
    const resolvedParams = React.use(params)
  return <Planet id={resolvedParams.id} />;
} 