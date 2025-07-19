'use client';

import React, { useState } from 'react';
import MyHeritageCard from './MyHeritageCard';
import { Person, ParentType } from '@/types/family';
import { getOrderedPartners } from '@/utils/relationshipUtils';

interface StackedCardsProps {
  people: Person[];
  position: { x: number; y: number };
  onPersonClick?: (person: Person) => void;
  selectedPersonId?: string;
  getRelationshipLabel: (personId: string) => string;
  stackType: 'horizontal' | 'vertical';
  groupType?: string; // Pour identifier le type de groupe (ex: 'spouses')
  allPeople?: Person[]; // Liste complète pour le tri chronologique
  getParentType?: (personId: string) => ParentType | undefined; // Fonction pour obtenir le type de parenté
}

const StackedCards: React.FC<StackedCardsProps> = ({
  people,
  position,
  onPersonClick,
  selectedPersonId,
  getRelationshipLabel,
  stackType = 'horizontal',
  groupType,
  allPeople,
  getParentType
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Trier les personnes selon le type de groupe
  const sortedPeople = React.useMemo(() => {
    if ((groupType === 'spouses' || groupType === 'partners') && allPeople) {
      // Pour les conjoints/partenaires, utiliser l'ordre chronologique
      // Trouver la personne de référence (utilisateur ou membre de famille avec relations)
      const referencePerson = allPeople.find(p => 
        p.isCurrentUser || (p.relationships && p.relationships.length > 0 &&
        p.relationships.some(rel => people.some(person => person.id === rel.partnerId)))
      );
      
      if (referencePerson && referencePerson.relationships) {
        const orderedPartners = getOrderedPartners(referencePerson, allPeople);
        // Filtrer pour ne garder que ceux qui sont dans le groupe
        return orderedPartners.filter(partner => 
          people.some(p => p.id === partner.id)
        );
      }
    } else if (groupType === 'siblings') {
      // Pour la fratrie, mettre l'utilisateur (Moi) au sommet
      const currentUser = people.find(p => p.isCurrentUser);
      const otherSiblings = people.filter(p => !p.isCurrentUser);
      
      if (currentUser) {
        // Utilisateur en premier, puis les autres dans l'ordre original
        return [currentUser, ...otherSiblings];
      }
    }
    // Pour les autres groupes, garder l'ordre original
    return people;
  }, [people, groupType, allPeople]);

  const [topCardIndex, setTopCardIndex] = useState(0); // Index de la carte du dessus

  const handleStackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handlePersonClick = (person: Person, e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    
    // Si on clique sur une carte quand déployé, remettre en pile avec cette carte au dessus
    if (isExpanded) {
      setTopCardIndex(index);
      setIsExpanded(false);
      return;
    }
    
    if (onPersonClick) {
      onPersonClick(person);
    }
  };

  const getCardPosition = (index: number, total: number) => {
    if (!isExpanded) {
      // État empilé - décalage léger pour effet "cartes à jouer"
      const offset = stackType === 'horizontal' ? 15 : 10;
      
      // Calculer l'ordre d'empilement basé sur topCardIndex
      let stackOrder;
      if (index === topCardIndex) {
        stackOrder = 0; // La carte sélectionnée est au dessus
      } else if (index < topCardIndex) {
        stackOrder = index + 1;
      } else {
        stackOrder = index;
      }
      
      return {
        x: stackType === 'horizontal' ? stackOrder * offset : 0,
        y: stackType === 'vertical' ? stackOrder * offset : 0,
        zIndex: total - stackOrder // Plus petit stackOrder = z-index plus élevé
      };
    } else {
      // État déployé - cartes étalées
      const spacing = 180; // Espacement entre cartes déployées
      if (stackType === 'horizontal') {
        return {
          x: (index - (total - 1) / 2) * spacing,
          y: 0,
          zIndex: 1
        };
      } else {
        return {
          x: 0,
          y: (index - (total - 1) / 2) * 120,
          zIndex: 1
        };
      }
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isExpanded ? 'default' : 'pointer'
      }}
      onClick={!isExpanded ? handleStackClick : undefined}
    >
      {/* Indicateur visuel pour pile fermée */}
      {!isExpanded && sortedPeople.length > 1 && (
        <div
          style={{
            position: 'absolute',
            top: -10,
            right: -10,
            backgroundColor: '#007EB9',
            color: 'white',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 1000,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {sortedPeople.length}
        </div>
      )}

      {/* Cartes */}
      {sortedPeople.map((person, index) => {
        const cardPos = getCardPosition(index, sortedPeople.length);
        return (
          <div
            key={person.id}
            style={{
              position: 'absolute',
              left: `${cardPos.x}px`,
              top: `${cardPos.y}px`,
              zIndex: cardPos.zIndex,
              transition: 'all 0.3s ease-in-out',
              transform: !isExpanded && index !== topCardIndex ? 'scale(0.95)' : 'scale(1)',
              opacity: !isExpanded && index !== topCardIndex ? 0.8 : 1
            }}
            onClick={(e) => isExpanded ? handlePersonClick(person, e, index) : undefined}
          >
            <MyHeritageCard
              person={person}
              onClick={isExpanded ? undefined : onPersonClick}
              isSelected={selectedPersonId === person.id}
              relationship={getRelationshipLabel(person.id)}
              parentType={getParentType ? getParentType(person.id) : undefined}
            />
          </div>
        );
      })}

      {/* Bouton de fermeture quand déployé */}
      {isExpanded && (
        <button
          style={{
            position: 'absolute',
            top: -15,
            right: -15,
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: 30,
            height: 30,
            cursor: 'pointer',
            fontSize: '16px',
            zIndex: 1001,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          onClick={handleStackClick}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default StackedCards;