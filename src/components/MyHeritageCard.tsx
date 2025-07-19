'use client';

import React from 'react';
import { Person, ParentType } from '@/types/family';
import { getParentTypeColor, getParentTypeLabel } from '@/utils/parentTypeUtils';

interface MyHeritageCardProps {
  person: Person;
  onClick?: (person: Person) => void;
  isSelected?: boolean;
  relationship?: string;
  parentType?: ParentType; // Type de parenté pour le code couleur
}

const MyHeritageCard: React.FC<MyHeritageCardProps> = ({
  person,
  onClick,
  isSelected = false,
  relationship,
  parentType,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(person);
    }
  };

  const getAge = (birthDate?: string, deathDate?: string): string => {
    if (!birthDate) return '';
    
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    const age = Math.floor((end.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    
    return `${age} ans`;
  };

  const getYearRange = (): string => {
    if (!person.birthDate) return '';
    
    const birthYear = new Date(person.birthDate).getFullYear();
    if (person.deathDate) {
      const deathYear = new Date(person.deathDate).getFullYear();
      return `${birthYear} - ${deathYear}`;
    }
    return `${birthYear}`;
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: '140px',
        height: '80px',
        backgroundColor: person.isCurrentUser ? '#e3f2fd' : 'white',
        border: isSelected ? '2px solid #2196F3' : '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: onClick ? 'pointer' : 'default',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        transition: 'all 0.2s ease',
        position: 'relative',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Avatar avec initiales */}
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#666',
        border: '1px solid #ddd',
      }}>
        {person.firstName[0]}{person.lastName[0]}
      </div>

      {/* Nom */}
      <div style={{
        fontSize: '12px',
        fontWeight: 'bold',
        color: person.deathDate ? '#666' : '#333',
        textAlign: 'center',
        lineHeight: '1.2',
        maxWidth: '120px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {person.firstName} {person.lastName}
      </div>

      {/* Nom de jeune fille */}
      {person.maidenName && (
        <div style={{
          fontSize: '10px',
          color: '#666',
          fontStyle: 'italic',
          textAlign: 'center',
        }}>
          (née {person.maidenName})
        </div>
      )}


      {/* Badge "Moi" */}
      {person.isCurrentUser && (
        <div style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          backgroundColor: '#4CAF50',
          color: 'white',
          fontSize: '8px',
          padding: '1px 4px',
          borderRadius: '3px',
          fontWeight: 'bold',
        }}>
          Moi
        </div>
      )}

      {/* Badge de relation avec code couleur */}
      {relationship && !person.isCurrentUser && (
        <div style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          backgroundColor: parentType ? getParentTypeColor(parentType) : '#2196F3',
          color: 'white',
          fontSize: '8px',
          padding: '1px 4px',
          borderRadius: '3px',
          fontWeight: 'bold',
          border: parentType ? `1px solid ${getParentTypeColor(parentType)}` : 'none',
        }}>
          {parentType ? `${relationship} (${getParentTypeLabel(parentType)})` : relationship}
        </div>
      )}
    </div>
  );
};

export default MyHeritageCard;