
'use client';
import dynamic from 'next/dynamic';
const TripMap = dynamic(() => import('./components/TripMap'), { ssr: false });
export default function Home() {
    return (
        <main>
            <TripMap />
        </main>
    );
}

