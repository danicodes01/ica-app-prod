'use client'
import * as React from 'react'
import { Planet } from '@/components/planet/planet'; 
import { useParams } from 'next/navigation';

type ParamProps = {
    id: string
}

export default function PlanetPage() {
    const params = useParams<ParamProps>()
  return <Planet id={params.id} />;
} 