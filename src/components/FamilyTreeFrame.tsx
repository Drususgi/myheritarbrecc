'use client';

import React, { useState } from 'react';
import StackedCards from './StackedCards';
import MyHeritageCard from './MyHeritageCard';
import { Person } from '@/types/family';
import { Connection } from '@/types/layout';

interface FamilyGroup {
  people: string[];
  position: { x: number; y: number };
  stackType: 'horizontal' | 'vertical';
}

interface FamilyTreeFrameProps {
  title: string;
  people: Person[];
  stackedGroups: { [key: string]: FamilyGroup };
  individualPositions: { personId: string; x: number; y: number; width: number; height: number }[];
  connections: Connection[];
  onPersonClick?: (person: Person) => void;
  selectedPersonId?: string;
  getRelationshipLabel: (personId: string) => string;
  frameStyle?: React.CSSProperties;
  isActive?: boolean;
}

const FamilyTreeFrame: React.FC<FamilyTreeFrameProps> = ({
  title,
  people,
  stackedGroups,
  individualPositions,
  connections,
  onPersonClick,
  selectedPersonId,
  getRelationshipLabel,
  frameStyle,
  isActive = true
}) => {
  const handlePersonClick = (person: Person) => {
    if (onPersonClick) {
      onPersonClick(person);
    }
  };

  const renderConnections = (connections: Connection[]) => {
    return connections.map((connection) => {
      const points = connection.points;
      if (points.length < 2) return null;

      const segments = [];
      for (let i = 0; i < points.length - 1; i++) {
        segments.push(
          <line
            key={`${connection.id}-segment-${i}`}
            x1={points[i].x}
            y1={points[i].y}
            x2={points[i + 1].x}
            y2={points[i + 1].y}
            stroke={connection.style.stroke}
            strokeWidth={connection.style.strokeWidth}
            strokeDasharray={connection.style.strokeDasharray}
          />
        );
      }

      return (
        <g key={connection.id}>
          {segments}
        </g>
      );
    });
  };

  const stackedPersonIds = new Set(
    Object.values(stackedGroups).flatMap(group => group.people)
  );

  const defaultFrameStyle: React.CSSProperties = {
    border: isActive ? '2px solid #007EB9' : '2px solid #ccc',
    borderRadius: '12px',
    backgroundColor: isActive ? 'rgba(0, 126, 185, 0.02)' : 'rgba(240, 240, 240, 0.3)',
    padding: '20px',
    margin: '10px',
    position: 'relative',
    minHeight: '600px',
    minWidth: '800px',
    boxShadow: isActive ? '0 4px 12px rgba(0, 126, 185, 0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease-in-out',
    ...frameStyle
  };

  return (
    <div style={defaultFrameStyle}>
      {/* Titre du cadre */}
      <div style={{
        position: 'absolute',
        top: '-15px',
        left: '20px',
        backgroundColor: isActive ? '#007EB9' : '#ccc',
        color: 'white',
        padding: '5px 15px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 1000
      }}>
        {title}
      </div>

      {/* Contenu de l'arbre familial */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        opacity: isActive ? 1 : 0.6,
        transition: 'opacity 0.3s ease-in-out'
      }}>
        {/* Connexions */}
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
          {renderConnections(connections)}
        </svg>

        {/* Cartes empilées */}
        {Object.entries(stackedGroups).map(([groupName, group]) => {
          const groupPeople = group.people
            .map(personId => people.find(p => p.id === personId))
            .filter(Boolean) as Person[];
          
          if (groupPeople.length === 0) return null;
          
          return (
            <StackedCards
              key={groupName}
              people={groupPeople}
              position={group.position}
              onPersonClick={handlePersonClick}
              selectedPersonId={selectedPersonId}
              getRelationshipLabel={getRelationshipLabel}
              stackType={group.stackType}
            />
          );
        })}
        
        {/* Cartes individuelles */}
        {individualPositions.map((position) => {
          if (stackedPersonIds.has(position.personId)) return null;
          
          const person = people.find(p => p.id === position.personId);
          if (!person) return null;
          
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
    </div>
  );
};

export default FamilyTreeFrame;