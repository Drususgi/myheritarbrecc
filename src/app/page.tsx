'use client';

import { useState } from 'react';
import MyHeritageTree from '@/components/MyHeritageTree';
import AutoLayoutTree from '@/components/AutoLayoutTree';
import { Person } from '@/types/family';

export default function Home() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [layoutMode, setLayoutMode] = useState<'manual' | 'auto'>('manual');

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
    console.log('Person clicked:', person);
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      {/* Boutons pour basculer entre les modes */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 1000,
        display: 'flex',
        gap: '8px',
      }}>
        <button
          onClick={() => setLayoutMode('manual')}
          style={{
            padding: '8px 12px',
            backgroundColor: layoutMode === 'manual' ? '#007EB9' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Layout Manuel
        </button>
        <button
          onClick={() => setLayoutMode('auto')}
          style={{
            padding: '8px 12px',
            backgroundColor: layoutMode === 'auto' ? '#007EB9' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Layout Automatique
        </button>
      </div>

      {layoutMode === 'auto' ? (
        <AutoLayoutTree 
          onPersonClick={handlePersonClick}
          selectedPersonId={selectedPerson?.id}
        />
      ) : (
        <MyHeritageTree 
          onPersonClick={handlePersonClick}
          selectedPersonId={selectedPerson?.id}
        />
      )}
    </div>
  );
}