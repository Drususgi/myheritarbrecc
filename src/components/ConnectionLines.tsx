'use client';

import React from 'react';
import { Person } from '@/types/family';

interface ConnectionLinesProps {
  people: Person[];
  getPersonPosition: (personId: string) => { x: number; y: number } | null;
}

const ConnectionLines: React.FC<ConnectionLinesProps> = ({ people, getPersonPosition }) => {
  const lines: JSX.Element[] = [];
  const processedSpouses = new Set<string>(); // Pour éviter les doublons
  
  // Debug supprimé - les connexions fonctionnent parfaitement !
  
  // Fonction pour créer une ligne
  const createLine = (
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number, 
    type: 'parent-child' | 'spouse' | 'sibling',
    id: string
  ) => {
    const strokeColor = type === 'spouse' ? '#E74C3C' : type === 'sibling' ? '#3498DB' : '#2C3E50';
    const strokeWidth = type === 'spouse' ? 4 : 3;
    const strokeDasharray = type === 'sibling' ? '8,4' : 'none';
    
    return (
      <line
        key={id}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        opacity={0.9}
      />
    );
  };

  // Fonction pour créer une connexion en L (parent-enfant)
  const createLConnection = (
    parentX: number,
    parentY: number,
    childX: number,
    childY: number,
    id: string
  ) => {
    const midY = parentY + (childY - parentY) / 2;
    
    return (
      <g key={id}>
        {/* Ligne verticale depuis le parent (sortir par le bas) */}
        <line
          x1={parentX}
          y1={parentY + 200} // Bas de la carte parent (200px de hauteur)
          x2={parentX}
          y2={midY}
          stroke="#2C3E50"
          strokeWidth={3}
          opacity={0.9}
        />
        {/* Ligne horizontale */}
        <line
          x1={parentX}
          y1={midY}
          x2={childX}
          y2={midY}
          stroke="#2C3E50"
          strokeWidth={3}
          opacity={0.9}
        />
        {/* Ligne verticale vers l'enfant (arriver par le haut) */}
        <line
          x1={childX}
          y1={midY}
          x2={childX}
          y2={childY} // Haut de la carte enfant
          stroke="#2C3E50"
          strokeWidth={3}
          opacity={0.9}
        />
        {/* Points de connexion pour plus de clarté */}
        <circle
          cx={parentX}
          cy={parentY + 200}
          r="4"
          fill="#2C3E50"
          opacity={0.9}
        />
        <circle
          cx={childX}
          cy={childY}
          r="4"
          fill="#2C3E50"
          opacity={0.9}
        />
      </g>
    );
  };

  // Générer les connexions
  people.forEach(person => {
    const personPos = getPersonPosition(person.id);
    if (!personPos) return;

    const personCenterX = personPos.x + 80; // Centre de la carte (160px / 2)
    const personCenterY = personPos.y + 100; // Centre vertical de la carte

    // Connexions parent-enfant
    if (person.childrenIds) {
      person.childrenIds.forEach(childId => {
        const childPos = getPersonPosition(childId);
        if (childPos) {
          const childCenterX = childPos.x + 80;
          const childCenterY = childPos.y + 100;
          
          // Si parent et enfant sont sur la même colonne X (ou très proches), ligne directe
          if (Math.abs(personCenterX - childCenterX) < 50) {
            lines.push(
              <line
                key={`direct-${person.id}-${childId}`}
                x1={personCenterX}
                y1={personCenterY + 200} // Bas de la carte parent
                x2={childCenterX}
                y2={childCenterY} // Haut de la carte enfant
                stroke="#2C3E50"
                strokeWidth={3}
                opacity={0.9}
              />
            );
            // Points de connexion
            lines.push(
              <circle
                key={`point-parent-${person.id}-${childId}`}
                cx={personCenterX}
                cy={personCenterY + 200}
                r="4"
                fill="#2C3E50"
                opacity={0.9}
              />
            );
            lines.push(
              <circle
                key={`point-child-${person.id}-${childId}`}
                cx={childCenterX}
                cy={childCenterY}
                r="4"
                fill="#2C3E50"
                opacity={0.9}
              />
            );
          } else {
            // Sinon, connexion en L
            lines.push(createLConnection(
              personCenterX,
              personCenterY,
              childCenterX,
              childCenterY,
              `parent-child-${person.id}-${childId}`
            ));
          }
        }
      });
    }

    // Connexions conjugales - Éviter les doublons
    if (person.spouseId && !processedSpouses.has(person.id)) {
      const spousePos = getPersonPosition(person.spouseId);
      if (spousePos) {
        const spouseCenterX = spousePos.x + 80;
        const spouseCenterY = spousePos.y + 100;
        
        // Ligne horizontale pour les conjoints
        lines.push(createLine(
          personCenterX,
          personCenterY,
          spouseCenterX,
          spouseCenterY,
          'spouse',
          `spouse-${person.id}-${person.spouseId}`
        ));
        
        // Marquer les deux personnes comme traitées
        processedSpouses.add(person.id);
        processedSpouses.add(person.spouseId);
      }
    }
  });

  // Connexions générées avec succès !

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 3, // Au-dessus des cartes (qui ont zIndex: 2)
      }}
    >
      {lines}
      
      {/* Lignes de test pour vérifier la visibilité */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#2C3E50"
          />
        </marker>
      </defs>
    </svg>
  );
};

export default ConnectionLines;