'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { familyTreeData } from '@/data/familyData';
import FamilyTreeFrame from './FamilyTreeFrame';
import { Person } from '@/types/family';
import { FamilyTreeLayoutEngine } from '@/utils/layoutEngine';
import { LayoutResult, Connection, PersonPosition } from '@/types/layout';

interface AutoLayoutTreeProps {
  onPersonClick?: (person: Person) => void;
  selectedPersonId?: string;
}

const AutoLayoutTree: React.FC<AutoLayoutTreeProps> = ({
  onPersonClick,
  selectedPersonId,
}) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [layoutResult, setLayoutResult] = useState<LayoutResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSpouseFamily, setActiveSpouseFamily] = useState<string | null>(null);
  const transformRef = useRef<any>(null);

  useEffect(() => {
    // Calculer le layout automatiquement au chargement
    const engine = new FamilyTreeLayoutEngine();
    const result = engine.calculateLayout(familyTreeData);
    
    console.log('Layout calculé:', result);
    setLayoutResult(result);
    setIsLoading(false);
  }, []);

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
    
    // Si c'est un conjoint, afficher sa famille
    if (person.id === 'spouse-001' || person.id === 'spouse-002') {
      setActiveSpouseFamily(person.id);
    }
    
    if (onPersonClick) {
      onPersonClick(person);
    }
  };

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

  // Fonction pour obtenir la relation par rapport à l'utilisateur
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

  // Famille principale (sans les familles des conjoints)
  const getMainFamilyGroups = () => {
    return {
      // Fratrie biologique (même Y = 330)
      siblings: {
        people: ['sibling-001', 'user-001', 'sibling-002', 'sibling-003'],
        position: { x: 320, y: 330 }, // Décalé vers la gauche
        stackType: 'horizontal' as const
      },
      // Épouses (même Y = 470)
      spouses: {
        people: ['spouse-001', 'spouse-002'],
        position: { x: 320, y: 470 }, // Décalé vers la gauche
        stackType: 'horizontal' as const
      },
      // Enfants (même Y = 610)
      children: {
        people: ['child-001', 'child-002', 'child-003', 'child-004', 'nephew-001'],
        position: { x: 320, y: 610 }, // Décalé vers la gauche
        stackType: 'horizontal' as const
      }
    };
  };

  // Positions individuelles pour la famille principale
  const getMainFamilyIndividualPositions = () => {
    if (!layoutResult) return [];
    
    const mainFamilyIds = new Set([
      'father-001', 'mother-001', 'grandfather-pat-001', 'grandmother-pat-001',
      'grandfather-mat-001', 'grandmother-mat-001', 'grandchild-001'
    ]);
    
    return layoutResult.positions
      .filter(pos => mainFamilyIds.has(pos.personId))
      .map(pos => ({
        ...pos,
        x: pos.x - 320 // Ajuster pour le cadre gauche
      }));
  };

  // Famille du conjoint sélectionné
  const getSpouseFamilyGroups = (spouseId: string) => {
    if (spouseId === 'spouse-001') {
      // Famille de Marie Martin (ex-épouse)
      return {
        // Parents de Marie
        parents: {
          people: ['father-spouse-001', 'mother-spouse-001'],
          position: { x: 200, y: 190 },
          stackType: 'horizontal' as const
        }
      };
    } else if (spouseId === 'spouse-002') {
      // Famille de Sarah Martin (épouse actuelle)
      return {
        // Parents de Sarah (à créer dans les données)
        // Pour l'instant, structure vide
      };
    }
    
    return {};
  };

  // Positions individuelles pour la famille du conjoint
  const getSpouseFamilyIndividualPositions = (spouseId: string) => {
    if (!layoutResult) return [];
    
    if (spouseId === 'spouse-001') {
      const spouseFamilyIds = new Set(['father-spouse-001', 'mother-spouse-001']);
      return layoutResult.positions
        .filter(pos => spouseFamilyIds.has(pos.personId))
        .map(pos => ({
          ...pos,
          x: pos.x - 640 // Ajuster pour le cadre droit
        }));
    }
    
    return [];
  };

  // Filtrer les connexions pour chaque cadre
  const getMainFamilyConnections = () => {
    if (!layoutResult) return [];
    
    const mainFamilyIds = new Set([
      'father-001', 'mother-001', 'grandfather-pat-001', 'grandmother-pat-001',
      'grandfather-mat-001', 'grandmother-mat-001', 'grandchild-001',
      'sibling-001', 'user-001', 'sibling-002', 'sibling-003',
      'spouse-001', 'spouse-002',
      'child-001', 'child-002', 'child-003', 'child-004', 'nephew-001'
    ]);
    
    return layoutResult.connections.filter(conn => 
      mainFamilyIds.has(conn.from.personId) && mainFamilyIds.has(conn.to.personId)
    ).map(conn => ({
      ...conn,
      points: conn.points.map(point => ({
        ...point,
        x: point.x - 320 // Ajuster pour le cadre gauche
      }))
    }));
  };

  const getSpouseFamilyConnections = (spouseId: string) => {
    if (!layoutResult) return [];
    
    if (spouseId === 'spouse-001') {
      const spouseFamilyIds = new Set(['father-spouse-001', 'mother-spouse-001']);
      return layoutResult.connections.filter(conn => 
        spouseFamilyIds.has(conn.from.personId) && spouseFamilyIds.has(conn.to.personId)
      ).map(conn => ({
        ...conn,
        points: conn.points.map(point => ({
          ...point,
          x: point.x - 640 // Ajuster pour le cadre droit
        }))
      }));
    }
    
    return [];
  };

  if (isLoading) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Calcul du layout automatique...</div>
      </div>
    );
  }

  if (!layoutResult) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Erreur lors du calcul du layout</div>
      </div>
    );
  }

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
        flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
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
        
        {/* Informations de debug */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '12px',
          maxWidth: '200px'
        }}>
          <div><strong>Layout automatique</strong></div>
          <div>Personnes: {layoutResult.positions.length}</div>
          <div>Connexions: {layoutResult.connections.length}</div>
          <div>Conflits: {layoutResult.conflicts.length}</div>
          <div>Temps: {layoutResult.metadata.layoutTime.toFixed(2)}ms</div>
        </div>
      </div>

      {/* Arbre avec navigation */}
      <TransformWrapper
        ref={transformRef}
        initialScale={0.6}
        minScale={0.2}
        maxScale={2}
        centerOnInit={true}
        limitToBounds={false}
        doubleClick={{ disabled: false }}
        panning={{ disabled: false }}
        wheel={{ step: 0.1 }}
      >
        <TransformComponent>
          <div style={{
            width: '1800px',
            height: '1000px',
            position: 'relative',
            padding: '20px',
            display: 'flex',
            gap: '20px'
          }}>
            {/* Cadre famille principale */}
            <FamilyTreeFrame
              title="Famille Principale"
              people={familyTreeData.people}
              stackedGroups={getMainFamilyGroups()}
              individualPositions={getMainFamilyIndividualPositions()}
              connections={getMainFamilyConnections()}
              onPersonClick={handlePersonClick}
              selectedPersonId={selectedPersonId}
              getRelationshipLabel={getRelationshipLabel}
              isActive={true}
              frameStyle={{ flex: 1 }}
            />

            {/* Cadre famille du conjoint (conditionnel) */}
            {activeSpouseFamily && (
              <>
                {/* Ligne de connexion entre les cadres */}
                <div style={{
                  position: 'relative',
                  width: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '3px',
                    height: '80%',
                    backgroundColor: '#007EB9',
                    borderRadius: '2px'
                  }} />
                  <div style={{
                    position: 'absolute',
                    backgroundColor: '#007EB9',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-90deg)',
                    whiteSpace: 'nowrap'
                  }}>
                    Famille de {familyTreeData.people.find(p => p.id === activeSpouseFamily)?.firstName}
                  </div>
                </div>

                <FamilyTreeFrame
                  title={`Famille de ${familyTreeData.people.find(p => p.id === activeSpouseFamily)?.firstName}`}
                  people={familyTreeData.people}
                  stackedGroups={getSpouseFamilyGroups(activeSpouseFamily)}
                  individualPositions={getSpouseFamilyIndividualPositions(activeSpouseFamily)}
                  connections={getSpouseFamilyConnections(activeSpouseFamily)}
                  onPersonClick={handlePersonClick}
                  selectedPersonId={selectedPersonId}
                  getRelationshipLabel={getRelationshipLabel}
                  isActive={true}
                  frameStyle={{ flex: 1 }}
                />

                {/* Bouton pour fermer la famille du conjoint */}
                <button
                  style={{
                    position: 'absolute',
                    top: '30px',
                    right: '30px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    fontSize: '20px',
                    zIndex: 1001,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                  onClick={() => setActiveSpouseFamily(null)}
                  title="Fermer la famille du conjoint"
                >
                  ×
                </button>
              </>
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default AutoLayoutTree;