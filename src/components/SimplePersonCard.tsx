'use client';

import React from 'react';
import { Person } from '@/types/family';

interface SimplePersonCardProps {
  person: Person;
  onClick?: (person: Person) => void;
  isSelected?: boolean;
}

const SimplePersonCard: React.FC<SimplePersonCardProps> = ({
  person,
  onClick,
  isSelected = false,
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
    
    return deathDate ? `${age} ans` : `${age} ans`;
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: '160px',
        height: '200px',
        backgroundColor: person.isCurrentUser ? '#e3f2fd' : 'white',
        border: isSelected ? '2px solid #007EB9' : '1px solid #e1e8ed',
        borderRadius: '8px',
        boxShadow: isSelected ? '0 4px 12px rgba(0, 126, 185, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
        cursor: onClick ? 'pointer' : 'default',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
    >
      {/* Badge utilisateur actuel */}
      {person.isCurrentUser && (
        <div style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          backgroundColor: '#28a745',
          color: 'white',
          fontSize: '10px',
          padding: '2px 6px',
          borderRadius: '4px',
        }}>
          Moi
        </div>
      )}

      {/* Avatar avec initiales */}
      <div style={{
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        backgroundColor: '#e1e8ed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#666',
        border: '2px solid #e1e8ed',
      }}>
        {person.firstName[0]}{person.lastName[0]}
      </div>

      {/* Nom */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: person.deathDate ? '#666' : '#333',
          textDecoration: person.deathDate ? 'line-through' : 'none',
        }}>
          {person.firstName} {person.lastName}
        </div>
        {person.maidenName && (
          <div style={{
            fontSize: '12px',
            color: '#666',
            fontStyle: 'italic',
          }}>
            (née {person.maidenName})
          </div>
        )}
      </div>

      {/* Dates */}
      {person.birthDate && (
        <div style={{
          fontSize: '12px',
          color: '#666',
          textAlign: 'center',
        }}>
          {new Date(person.birthDate).getFullYear()}
          {person.deathDate && ` - ${new Date(person.deathDate).getFullYear()}`}
        </div>
      )}

      {/* Âge */}
      {person.birthDate && (
        <div style={{
          fontSize: '12px',
          color: '#666',
          textAlign: 'center',
        }}>
          {getAge(person.birthDate, person.deathDate)}
        </div>
      )}

      {/* Lieu de naissance */}
      {person.birthPlace && (
        <div style={{
          fontSize: '11px',
          color: '#666',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '150px',
        }}>
          📍 {person.birthPlace}
        </div>
      )}

      {/* Profession */}
      {person.occupation && (
        <div style={{
          fontSize: '11px',
          color: '#666',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '150px',
        }}>
          💼 {person.occupation}
        </div>
      )}
    </div>
  );
};

export default SimplePersonCard;