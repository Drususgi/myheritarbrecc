'use client';

import React, { useState, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { familyTreeData } from '@/data/familyData';
import MyHeritageCard from './MyHeritageCard';
import { Person } from '@/types/family';

interface MyHeritageTreeProps {
  onPersonClick?: (person: Person) => void;
  selectedPersonId?: string;
}

const MyHeritageTree: React.FC<MyHeritageTreeProps> = ({
  onPersonClick,
  selectedPersonId,
}) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const transformRef = useRef<any>(null);

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
    if (onPersonClick) {
      onPersonClick(person);
    }
  };

  // Fonctions pour les boutons de navigation
  const handleZoomIn = () => {
    transformRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    transformRef.current?.zoomOut();
  };

  const handleResetView = () => {
    transformRef.current?.resetTransform();
  };

  const handleCenterOnUser = () => {
    transformRef.current?.setTransform(-500, -400, 1);
  };

  // Layout MyHeritage : structure en diamant/pyramide avec plus d'espacement
  const getPersonPosition = (personId: string): { x: number; y: number } => {
    const positions: { [key: string]: { x: number; y: number } } = {
      // Génération -2 (arrière-grands-parents) - En haut, plus d'espacement
      'grandfather-pat-001': { x: 150, y: 50 },   // Henri
      'grandmother-pat-001': { x: 350, y: 50 },   // Marguerite
      'grandfather-mat-001': { x: 750, y: 50 },   // Robert
      'grandmother-mat-001': { x: 950, y: 50 },   // Jeanne
      
      // Génération -1 (grands-parents) - Niveau 2, plus d'espacement vertical
      'father-001': { x: 250, y: 230 },           // Pierre
      'mother-001': { x: 450, y: 230 },           // Sophie
      'father-spouse-001': { x: 850, y: 230 },    // Michel
      'mother-spouse-001': { x: 1050, y: 230 },   // Catherine
      
      // Génération 0 (parents/utilisateur) - Centre, plus d'espacement
      'user-001': { x: 350, y: 420 },             // Jean (utilisateur)
      'spouse-001': { x: 550, y: 420 },           // Marie (1ère épouse)
      'spouse-002': { x: 750, y: 420 },           // Sarah (2ème épouse)
      'sibling-001': { x: 950, y: 420 },          // Paul
      'sibling-002': { x: 1150, y: 420 },         // Marie-Claire
      'sibling-003': { x: 1350, y: 420 },         // Isabelle
      
      // Génération +1 (enfants) - Niveau 4, plus d'espacement vertical
      'child-001': { x: 250, y: 610 },            // Lucas (Jean + Marie)
      'child-002': { x: 450, y: 610 },            // Emma (Jean + Marie)
      'child-003': { x: 650, y: 610 },            // Léo (Jean + Sarah)
      'child-004': { x: 850, y: 610 },            // Chloé (Jean + Sarah)
      'nephew-001': { x: 950, y: 610 },           // Thomas
      
      // Génération +2 (petits-enfants) - En bas, plus d'espacement
      'grandchild-001': { x: 350, y: 800 },       // Hugo
    };

    return positions[personId] || { x: 500, y: 400 };
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      overflow: 'hidden',
    }}>
      {/* Contrôles de navigation */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 1000,
        display: 'flex',
        gap: '8px',
      }}>
        <button onClick={handleZoomIn} style={{ padding: '8px 12px', backgroundColor: '#007EB9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          🔍+
        </button>
        <button onClick={handleZoomOut} style={{ padding: '8px 12px', backgroundColor: '#007EB9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          🔍-
        </button>
        <button onClick={handleResetView} style={{ padding: '8px 12px', backgroundColor: '#007EB9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ↻
        </button>
        <button onClick={handleCenterOnUser} style={{ padding: '8px 12px', backgroundColor: '#007EB9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          🏠
        </button>
      </div>

      {/* Arbre avec navigation */}
      <TransformWrapper
        ref={transformRef}
        initialScale={0.8}
        minScale={0.3}
        maxScale={3}
        centerOnInit={true}
        limitToBounds={false}
        doubleClick={{ disabled: false }}
        panning={{ disabled: false }}
        wheel={{ step: 0.1 }}
      >
        <TransformComponent>
          <div style={{
            width: '1600px',
            height: '1200px',
            position: 'relative',
            padding: '50px',
          }}>
            {/* Lignes de connexion très fines avec labels */}
            <svg
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              {/* Connections génération -2 vers -1 - Centrées sur les cartes */}
              {/* Henri/Marguerite vers Pierre (centre cartes: Henri=220, Marguerite=420, Pierre=320) */}
              <line x1={220} y1={150} x2={220} y2={190} stroke="#ccc" strokeWidth={1} />
              <line x1={220} y1={190} x2={420} y2={190} stroke="#ccc" strokeWidth={1} />
              <line x1={420} y1={190} x2={420} y2={200} stroke="#ccc" strokeWidth={1} />
              <line x1={320} y1={200} x2={320} y2={230} stroke="#ccc" strokeWidth={1} />
              <line x1={320} y1={200} x2={420} y2={200} stroke="#ccc" strokeWidth={1} />
              
              {/* Henri/Marguerite vers Sophie (centre Sophie=520) */}
              <line x1={320} y1={200} x2={520} y2={200} stroke="#ccc" strokeWidth={1} />
              <line x1={520} y1={200} x2={520} y2={230} stroke="#ccc" strokeWidth={1} />
              
              {/* Robert/Jeanne vers Michel (centre cartes: Robert=820, Jeanne=1020, Michel=920) */}
              <line x1={820} y1={150} x2={820} y2={190} stroke="#ccc" strokeWidth={1} />
              <line x1={820} y1={190} x2={1020} y2={190} stroke="#ccc" strokeWidth={1} />
              <line x1={1020} y1={190} x2={1020} y2={200} stroke="#ccc" strokeWidth={1} />
              <line x1={920} y1={200} x2={920} y2={230} stroke="#ccc" strokeWidth={1} />
              <line x1={920} y1={200} x2={1020} y2={200} stroke="#ccc" strokeWidth={1} />
              
              {/* Robert/Jeanne vers Catherine (centre Catherine=1120) */}
              <line x1={920} y1={200} x2={1120} y2={200} stroke="#ccc" strokeWidth={1} />
              <line x1={1120} y1={200} x2={1120} y2={230} stroke="#ccc" strokeWidth={1} />
              
              {/* Connections génération -1 vers 0 - Système unifié parents → tous les enfants */}
              {/* Ligne verticale commune des parents Pierre/Sophie (centre des cartes) */}
              <line x1={320} y1={330} x2={320} y2={360} stroke="#ccc" strokeWidth={1} />
              <line x1={320} y1={360} x2={520} y2={360} stroke="#ccc" strokeWidth={1} />
              <line x1={520} y1={360} x2={520} y2={330} stroke="#ccc" strokeWidth={1} />
              {/* Point central de branchement parents */}
              <line x1={420} y1={360} x2={420} y2={410} stroke="#ccc" strokeWidth={1} />
              
              {/* Ligne horizontale de distribution vers tous les enfants (fratrie) - Plus près des cartes */}
              <line x1={420} y1={410} x2={1420} y2={410} stroke="#4CAF50" strokeWidth={2} strokeDasharray="3,3" />
              
              {/* Connexions vers chaque enfant Pierre/Sophie (fratrie en vert) */}
              {/* Jean (centre: 350+70=420) */}
              <line x1={420} y1={410} x2={420} y2={420} stroke="#4CAF50" strokeWidth={2} />
              {/* Paul (centre: 950+70=1020) */}
              <line x1={1020} y1={410} x2={1020} y2={420} stroke="#4CAF50" strokeWidth={2} />
              {/* Marie-Claire (centre: 1150+70=1220) */}
              <line x1={1220} y1={410} x2={1220} y2={420} stroke="#4CAF50" strokeWidth={2} />
              {/* Isabelle (centre: 1350+70=1420) */}
              <line x1={1420} y1={410} x2={1420} y2={420} stroke="#4CAF50" strokeWidth={2} />
              
              {/* Michel/Catherine vers Marie (centre cartes: Michel=920, Catherine=1120, Marie=620) */}
              {/* Connexion séparée pour éviter confusion avec la fratrie - Lignes mixtes pour ex-belle-famille */}
              <line x1={920} y1={330} x2={920} y2={380} stroke="#999" strokeWidth={1} strokeDasharray="5,2,2,2" />
              <line x1={920} y1={380} x2={1120} y2={380} stroke="#999" strokeWidth={1} strokeDasharray="5,2,2,2" />
              <line x1={1120} y1={380} x2={1120} y2={330} stroke="#999" strokeWidth={1} strokeDasharray="5,2,2,2" />
              <line x1={1020} y1={380} x2={1020} y2={390} stroke="#999" strokeWidth={1} strokeDasharray="5,2,2,2" />
              <line x1={620} y1={390} x2={620} y2={420} stroke="#999" strokeWidth={1} strokeDasharray="5,2,2,2" />
              <line x1={620} y1={390} x2={1020} y2={390} stroke="#999" strokeWidth={1} strokeDasharray="5,2,2,2" />
              
              {/* Lignes d'union Jean avec ses épouses */}
              {/* Jean-Marie (centre cartes: Jean=420, Marie=620) - Ligne mixte pour ex-épouse */}
              <line x1={420} y1={470} x2={620} y2={470} stroke="#d32f2f" strokeWidth={2} strokeDasharray="8,3,2,3" />
              {/* Jean-Sarah (centre cartes: Jean=420, Sarah=820) - Ligne continue pour épouse actuelle */}
              <line x1={420} y1={480} x2={820} y2={480} stroke="#d32f2f" strokeWidth={2} />
              
              {/* Connections génération 0 vers +1 - Système unifié par couple */}
              {/* Jean/Marie vers leurs enfants (Lucas et Emma) - Lignes mixtes pour ex-couple */}
              <line x1={420} y1={520} x2={420} y2={580} stroke="#999" strokeWidth={1} strokeDasharray="4,2,1,2" />
              <line x1={420} y1={580} x2={620} y2={580} stroke="#999" strokeWidth={1} strokeDasharray="4,2,1,2" />
              <line x1={620} y1={580} x2={620} y2={520} stroke="#999" strokeWidth={1} strokeDasharray="4,2,1,2" />
              <line x1={520} y1={580} x2={520} y2={590} stroke="#999" strokeWidth={1} strokeDasharray="4,2,1,2" />
              {/* Lucas (centre: 250+70=320) */}
              <line x1={320} y1={590} x2={320} y2={610} stroke="#999" strokeWidth={1} strokeDasharray="4,2,1,2" />
              <line x1={320} y1={590} x2={520} y2={590} stroke="#999" strokeWidth={1} strokeDasharray="4,2,1,2" />
              {/* Emma (centre: 450+70=520) */}
              <line x1={520} y1={590} x2={520} y2={610} stroke="#999" strokeWidth={1} strokeDasharray="4,2,1,2" />
              
              {/* Jean/Sarah vers leurs enfants (Léo et Chloé) */}
              <line x1={420} y1={525} x2={420} y2={585} stroke="#ccc" strokeWidth={1} />
              <line x1={420} y1={585} x2={820} y2={585} stroke="#ccc" strokeWidth={1} />
              <line x1={820} y1={585} x2={820} y2={525} stroke="#ccc" strokeWidth={1} />
              <line x1={620} y1={585} x2={620} y2={595} stroke="#ccc" strokeWidth={1} />
              {/* Léo (centre: 650+70=720) */}
              <line x1={720} y1={595} x2={720} y2={610} stroke="#ccc" strokeWidth={1} />
              <line x1={620} y1={595} x2={720} y2={595} stroke="#ccc" strokeWidth={1} />
              {/* Chloé (centre: 850+70=920) */}
              <line x1={920} y1={595} x2={920} y2={610} stroke="#ccc" strokeWidth={1} />
              <line x1={720} y1={595} x2={920} y2={595} stroke="#ccc" strokeWidth={1} />
              
              {/* Ligne de fratrie des enfants de Jean (tous ses enfants) */}
              <line x1={320} y1={580} x2={920} y2={580} stroke="#2196F3" strokeWidth={2} strokeDasharray="2,2" />
              {/* Connexions fratrie enfants */}
              <line x1={320} y1={580} x2={320} y2={585} stroke="#2196F3" strokeWidth={1} />
              <line x1={520} y1={580} x2={520} y2={585} stroke="#2196F3" strokeWidth={1} />
              <line x1={720} y1={580} x2={720} y2={585} stroke="#2196F3" strokeWidth={1} />
              <line x1={920} y1={580} x2={920} y2={585} stroke="#2196F3" strokeWidth={1} />
              
              {/* Paul vers Thomas (centre cartes: Paul=1020, Thomas=1020) */}
              <line x1={1020} y1={520} x2={1020} y2={610} stroke="#ccc" strokeWidth={1} />
              
              {/* Lucas vers Hugo (centre cartes: Lucas=320, Hugo=420) */}
              <line x1={320} y1={710} x2={320} y2={770} stroke="#ccc" strokeWidth={1} />
              <line x1={320} y1={770} x2={420} y2={770} stroke="#ccc" strokeWidth={1} />
              <line x1={420} y1={770} x2={420} y2={800} stroke="#ccc" strokeWidth={1} />
            </svg>

            {/* Cartes des personnes */}
            {familyTreeData.people.map((person) => {
              const position = getPersonPosition(person.id);
              
              // Fonction pour déterminer la relation par rapport à l'utilisateur
              const getRelationshipLabel = (personId: string): string => {
                const relationships: { [key: string]: string } = {
                  'father-001': 'Père',
                  'mother-001': 'Mère',
                  'grandfather-pat-001': 'Grand-père',
                  'grandmother-pat-001': 'Grand-mère',
                  'grandfather-mat-001': 'Grand-père',
                  'grandmother-mat-001': 'Grand-mère',
                  'spouse-001': 'Ex-épouse',
                  'spouse-002': 'Épouse',
                  'sibling-001': 'Frère',
                  'sibling-002': 'Sœur',
                  'sibling-003': 'Sœur',
                  'child-001': 'Fils',
                  'child-002': 'Fille',
                  'child-003': 'Fils',
                  'child-004': 'Fille',
                  'grandchild-001': 'Petit-fils',
                  'nephew-001': 'Neveu',
                  'father-spouse-001': 'Beau-père',
                  'mother-spouse-001': 'Belle-mère',
                };
                return relationships[personId] || '';
              };
              
              return (
                <div
                  key={person.id}
                  style={{
                    position: 'absolute',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    zIndex: 2,
                  }}
                >
                  <MyHeritageCard
                    person={person}
                    onClick={handlePersonClick}
                    isSelected={selectedPersonId === person.id}
                    relationship={getRelationshipLabel(person.id)}
                  />
                </div>
              );
            })}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default MyHeritageTree;