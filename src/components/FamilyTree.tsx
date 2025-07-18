'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { View, Flex, Button } from '@aws-amplify/ui-react';
import { ZoomIn, ZoomOut, RotateCcw, Home } from 'lucide-react';
import SimplePersonCard from './SimplePersonCard';
import { Person, TreeLayoutConfig, TreeViewport } from '@/types/family';
import { familyTreeData, getPersonById } from '@/data/familyData';

interface FamilyTreeProps {
  onPersonClick?: (person: Person) => void;
  selectedPersonId?: string;
}

const FamilyTree: React.FC<FamilyTreeProps> = ({
  onPersonClick,
  selectedPersonId,
}) => {
  const [viewport, setViewport] = useState<TreeViewport>({
    x: 0,
    y: 0,
    scale: 1,
    width: 0,
    height: 0,
  });

  const transformRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Configuration du layout
  const layoutConfig: TreeLayoutConfig = {
    cardWidth: 180,
    cardHeight: 220,
    horizontalSpacing: 60,
    verticalSpacing: 80,
    generationHeight: 300,
  };

  // Calculer les positions des personnes
  const calculatePersonPositions = (): Map<string, { x: number; y: number }> => {
    const positions = new Map<string, { x: number; y: number }>();
    const { people } = familyTreeData;
    
    // Grouper par génération
    const generations = new Map<number, Person[]>();
    people.forEach(person => {
      const gen = person.generation || 0;
      if (!generations.has(gen)) {
        generations.set(gen, []);
      }
      generations.get(gen)!.push(person);
    });

    // Calculer les positions pour chaque génération
    const sortedGenerations = Array.from(generations.keys()).sort((a, b) => a - b);
    
    sortedGenerations.forEach(genLevel => {
      const genPeople = generations.get(genLevel)!;
      const totalWidth = genPeople.length * layoutConfig.cardWidth + 
                        (genPeople.length - 1) * layoutConfig.horizontalSpacing;
      
      genPeople.forEach((person, index) => {
        const x = (index * (layoutConfig.cardWidth + layoutConfig.horizontalSpacing)) - (totalWidth / 2);
        const y = genLevel * layoutConfig.generationHeight;
        
        positions.set(person.id, { x, y });
      });
    });

    return positions;
  };

  const personPositions = calculatePersonPositions();

  // Centrer sur l'utilisateur actuel au chargement
  useEffect(() => {
    const currentUser = familyTreeData.people.find(p => p.isCurrentUser);
    if (currentUser && transformRef.current) {
      const position = personPositions.get(currentUser.id);
      if (position) {
        setTimeout(() => {
          transformRef.current?.setTransform(
            -position.x + (viewport.width / 2) - (layoutConfig.cardWidth / 2),
            -position.y + (viewport.height / 2) - (layoutConfig.cardHeight / 2),
            1
          );
        }, 100);
      }
    }
  }, [viewport.width, viewport.height, personPositions]);

  // Mettre à jour les dimensions du viewport
  useEffect(() => {
    const updateViewport = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setViewport(prev => ({
          ...prev,
          width: rect.width,
          height: rect.height,
        }));
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Fonctions de contrôle
  const handleZoomIn = () => {
    transformRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    transformRef.current?.zoomOut();
  };

  const handleReset = () => {
    transformRef.current?.resetTransform();
  };

  const handleCenterOnUser = () => {
    const currentUser = familyTreeData.people.find(p => p.isCurrentUser);
    if (currentUser) {
      const position = personPositions.get(currentUser.id);
      if (position) {
        transformRef.current?.setTransform(
          -position.x + (viewport.width / 2) - (layoutConfig.cardWidth / 2),
          -position.y + (viewport.height / 2) - (layoutConfig.cardHeight / 2),
          1
        );
      }
    }
  };

  const handlePersonClick = (person: Person) => {
    if (onPersonClick) {
      onPersonClick(person);
    }
  };

  return (
    <View
      ref={containerRef}
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f8f9fa',
      }}
    >
      {/* Contrôles de navigation */}
      <View
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 1000,
        }}
      >
        <Flex gap="small">
          <Button
            variation="primary"
            size="small"
            onClick={handleZoomIn}
            style={{ padding: '8px' }}
          >
            <ZoomIn size={16} />
          </Button>
          <Button
            variation="primary"
            size="small"
            onClick={handleZoomOut}
            style={{ padding: '8px' }}
          >
            <ZoomOut size={16} />
          </Button>
          <Button
            variation="primary"
            size="small"
            onClick={handleReset}
            style={{ padding: '8px' }}
          >
            <RotateCcw size={16} />
          </Button>
          <Button
            variation="primary"
            size="small"
            onClick={handleCenterOnUser}
            style={{ padding: '8px' }}
          >
            <Home size={16} />
          </Button>
        </Flex>
      </View>

      {/* Arbre généalogique */}
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.3}
        maxScale={3}
        limitToBounds={false}
        doubleClick={{ disabled: false }}
        panning={{ disabled: false }}
        wheel={{ step: 0.1 }}
        pinch={{ step: 5 }}
        centerOnInit={false}
        onTransformed={(ref) => {
          setViewport(prev => ({
            ...prev,
            x: ref.state.positionX,
            y: ref.state.positionY,
            scale: ref.state.scale,
          }));
        }}
      >
        <TransformComponent
          wrapperStyle={{
            width: '100%',
            height: '100%',
          }}
          contentStyle={{
            width: '100%',
            height: '100%',
          }}
        >
          <View
            style={{
              position: 'relative',
              width: '4000px',
              height: '3000px',
              transform: 'translate(2000px, 1500px)',
            }}
          >
            {/* Lignes de connexion - À implémenter dans la prochaine étape */}
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
              {/* Les lignes de connexion seront ajoutées ici */}
            </svg>

            {/* Cartes des personnes */}
            {familyTreeData.people.map((person) => {
              const position = personPositions.get(person.id);
              if (!position) return null;

              return (
                <View
                  key={person.id}
                  style={{
                    position: 'absolute',
                    left: position.x,
                    top: position.y,
                    zIndex: 2,
                  }}
                >
                  <SimplePersonCard
                    person={person}
                    onClick={handlePersonClick}
                    isSelected={selectedPersonId === person.id}
                  />
                </View>
              );
            })}
          </View>
        </TransformComponent>
      </TransformWrapper>
    </View>
  );
};

export default FamilyTree;