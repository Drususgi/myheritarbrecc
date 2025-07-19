'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { familyTreeData } from '@/data/familyData';
import FamilyTreeFrame from './FamilyTreeFrame';
import FamilyListView from './FamilyListView';
import { Person, ParentType } from '@/types/family';
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
  const [focalPersonId, setFocalPersonId] = useState<string>('user-001'); // Personne au centre de la perspective
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph'); // Mode d'affichage
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
    console.log('Clic sur personne:', person.firstName, person.id);
    setSelectedPerson(person);
    
    // Changer la perspective : reconstruire l'arbre centré sur cette personne
    console.log('Changement de perspective vers:', person.id);
    setFocalPersonId(person.id);
    
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

  // Fonction pour construire l'arbre selon la perspective d'une personne
  const buildTreeFromPerspective = (focalPersonId: string) => {
    const focalPerson = familyTreeData.people.find(p => p.id === focalPersonId);
    if (!focalPerson) {
      console.log('Personne focale non trouvée:', focalPersonId);
      return {};
    }

    console.log('Construction de l\'arbre pour:', focalPerson.firstName, focalPerson);

    // Obtenir les relations familiales de la personne focale
    const parentIds = focalPerson.parentIds || [];
    
    // Gestion des conjoints : relationships + spouseId pour rétrocompatibilité
    const spouseIds: string[] = [];
    if (focalPerson.relationships) {
      spouseIds.push(...focalPerson.relationships.map(r => r.partnerId));
    }
    if (focalPerson.spouseId && !spouseIds.includes(focalPerson.spouseId)) {
      spouseIds.push(focalPerson.spouseId);
    }
    
    // Fratrie : personnes qui partagent au moins un parent avec la personne focale
    const siblingIds = familyTreeData.people.filter(p => {
      if (p.id === focalPersonId) return false; // Exclure la personne elle-même
      const pParents = p.parentIds || [];
      const hasCommonParent = parentIds.some(parentId => pParents.includes(parentId));
      return hasCommonParent;
    }).map(p => p.id);
    
    const childrenIds = focalPerson.childrenIds || [];

    // Conjoints de la fratrie
    const siblingsSpouseIds = siblingIds.flatMap(siblingId => {
      const sibling = familyTreeData.people.find(p => p.id === siblingId);
      return sibling?.spouseId ? [sibling.spouseId] : [];
    }).filter(Boolean);

    // Neveux et nièces (enfants de la fratrie)
    const nephewsNiecesIds = siblingIds.flatMap(siblingId => {
      const sibling = familyTreeData.people.find(p => p.id === siblingId);
      return sibling?.childrenIds || [];
    });

    // Conjoints des neveux et nièces
    const nephewsNiecesSpouseIds = nephewsNiecesIds.flatMap(nephewNieceId => {
      const nephewNiece = familyTreeData.people.find(p => p.id === nephewNieceId);
      return nephewNiece?.spouseId ? [nephewNiece.spouseId] : [];
    }).filter(Boolean);

    // Arrière-neveux et nièces (enfants des neveux et nièces)
    const grandNephewsNiecesIds = nephewsNiecesIds.flatMap(nephewNieceId => {
      const nephewNiece = familyTreeData.people.find(p => p.id === nephewNieceId);
      return nephewNiece?.childrenIds || [];
    });

    console.log('Relations trouvées:', {
      parents: parentIds,
      spouses: spouseIds,
      siblings: siblingIds,
      siblingsSpouses: siblingsSpouseIds,
      children: childrenIds,
      nephewsNieces: nephewsNiecesIds,
      nephewsNiecesSpouses: nephewsNiecesSpouseIds,
      grandNephewsNieces: grandNephewsNiecesIds
    });

    // Construire les groupes familiaux depuis cette perspective
    const groups: { [key: string]: any } = {};

    // Grands-parents (parents des parents)
    if (parentIds.length > 0) {
      const paternalGrandparents = parentIds.length > 0 ? 
        familyTreeData.people.find(p => p.id === parentIds[0])?.parentIds || [] : [];
      const maternalGrandparents = parentIds.length > 1 ? 
        familyTreeData.people.find(p => p.id === parentIds[1])?.parentIds || [] : [];

      if (paternalGrandparents.length > 0) {
        groups.grandparentsPaternal = {
          people: paternalGrandparents,
          position: { x: 120, y: 50 },
          stackType: 'horizontal' as const
        };
      }

      if (maternalGrandparents.length > 0) {
        groups.grandparentsMaternal = {
          people: maternalGrandparents,
          position: { x: 520, y: 50 },
          stackType: 'horizontal' as const
        };
      }
    }

    // Parents
    if (parentIds.length > 0) {
      groups.parents = {
        people: parentIds,
        position: { x: 320, y: 190 },
        stackType: 'horizontal' as const
      };
    }

    // Fratrie (incluant la personne focale)
    const allSiblings = [focalPersonId, ...siblingIds];
    if (allSiblings.length > 0) {
      groups.siblings = {
        people: allSiblings,
        position: { x: 320, y: 330 },
        stackType: 'horizontal' as const
      };
    }

    // Conjoints/Partenaires
    if (spouseIds.length > 0) {
      groups.spouses = {
        people: spouseIds.filter(Boolean), // Enlever les valeurs undefined/null
        position: { x: 320, y: 470 },
        stackType: 'horizontal' as const
      };
    }

    // Enfants
    if (childrenIds.length > 0) {
      groups.children = {
        people: childrenIds,
        position: { x: 320, y: 610 },
        stackType: 'horizontal' as const
      };
    }

    // Beaux-enfants (conjoints des enfants)
    const inlawIds = childrenIds.flatMap(childId => {
      const child = familyTreeData.people.find(p => p.id === childId);
      return child?.spouseId ? [child.spouseId] : [];
    }).filter(Boolean);

    if (inlawIds.length > 0) {
      groups.inlaws = {
        people: inlawIds,
        position: { x: 520, y: 610 },
        stackType: 'horizontal' as const
      };
    }

    // Petits-enfants (enfants des enfants)
    const grandchildrenIds = childrenIds.flatMap(childId => {
      const child = familyTreeData.people.find(p => p.id === childId);
      return child?.childrenIds || [];
    });

    if (grandchildrenIds.length > 0) {
      groups.grandchildren = {
        people: grandchildrenIds,
        position: { x: 320, y: 750 },
        stackType: 'horizontal' as const
      };
    }

    // Conjoints de la fratrie
    if (siblingsSpouseIds.length > 0) {
      groups.siblings_spouses = {
        people: siblingsSpouseIds,
        position: { x: 520, y: 330 },
        stackType: 'horizontal' as const
      };
    }

    // Neveux et nièces
    if (nephewsNiecesIds.length > 0) {
      groups.nephews_nieces = {
        people: nephewsNiecesIds,
        position: { x: 120, y: 610 },
        stackType: 'horizontal' as const
      };
    }

    // Conjoints des neveux et nièces
    if (nephewsNiecesSpouseIds.length > 0) {
      groups.nephews_nieces_spouses = {
        people: nephewsNiecesSpouseIds,
        position: { x: 120, y: 750 },
        stackType: 'horizontal' as const
      };
    }

    // Arrière-neveux et nièces
    if (grandNephewsNiecesIds.length > 0) {
      groups.grand_nephews_nieces = {
        people: grandNephewsNiecesIds,
        position: { x: 120, y: 890 },
        stackType: 'horizontal' as const
      };
    }

    // Parents des petits-enfants (parents des petits-enfants qui ne sont pas nos enfants)
    const grandchildrenParentIds = grandchildrenIds.flatMap(grandchildId => {
      const grandchild = familyTreeData.people.find(p => p.id === grandchildId);
      const parents = grandchild?.parentIds || [];
      // Retourner seulement les parents qui ne sont pas nos enfants directs
      return parents.filter(parentId => !childrenIds.includes(parentId));
    }).filter((id, index, array) => array.indexOf(id) === index); // Déduplication

    if (grandchildrenParentIds.length > 0) {
      groups.grandchildren_parents = {
        people: grandchildrenParentIds,
        position: { x: 720, y: 750 },
        stackType: 'horizontal' as const
      };
    }

    console.log('Groupes générés:', groups);
    return groups;
  };

  // Fonction pour obtenir le type de parenté (pour le code couleur)
  const getParentType = (personId: string): ParentType | undefined => {
    // Exemples de types de parenté pour démonstration
    // Dans un vrai système, ces informations viendraient de la base de données
    const parentTypes: { [key: string]: ParentType } = {
      'sibling-004': 'biological', // Camille - demi-sœur biologique
      'mother-camille': 'step', // Belle-mère (deuxième épouse du père)
      'spouse-001': 'biological', // Ex-épouse (parent biologique des enfants)
      'spouse-002': 'biological', // Épouse actuelle (parent biologique des enfants)
      // Exemple d'enfant adopté (non présent dans les données actuelles)
      // 'adopted-child-001': 'adoptive',
      // Exemple de beau-parent
      // 'step-parent-001': 'step',
    };
    
    return parentTypes[personId];
  };

  // Fonction pour obtenir les labels de relation selon la personne focale
  const getRelationshipLabelFromPerspective = (personId: string, focalPersonId: string): string => {
    const focalPerson = familyTreeData.people.find(p => p.id === focalPersonId);
    const targetPerson = familyTreeData.people.find(p => p.id === personId);
    
    if (!focalPerson || !targetPerson) {
      console.log('Personne non trouvée:', { focalPersonId, personId });
      return '';
    }
    if (personId === focalPersonId) return 'Moi';

    console.log('Calcul relation entre', targetPerson.firstName, 'et', focalPerson.firstName);

    // Si c'est un parent de la personne focale
    if (focalPerson.parentIds?.includes(personId)) {
      // Déterminer si c'est le père ou la mère selon le genre, pas la position
      const gender = targetPerson.firstName; // Heuristique simple basée sur les prénoms
      
      if (gender === 'Pierre' || gender === 'Michel' || gender === 'Henri' || gender === 'Robert') {
        return 'Père';
      } else if (gender === 'Sophie' || gender === 'Marie' || gender === 'Anne' || gender === 'Catherine') {
        return 'Mère';
      } else {
        return 'Parent';
      }
    }

    // Si c'est un grand-parent
    const parentIds = focalPerson.parentIds || [];
    for (const parentId of parentIds) {
      const parent = familyTreeData.people.find(p => p.id === parentId);
      if (parent?.parentIds?.includes(personId)) {
        const isPaternal = parentIds.indexOf(parentId) === 0;
        const gender = targetPerson.firstName;
        
        if (gender === 'Henri' || gender === 'Robert' || gender === 'René') {
          return isPaternal ? 'Grand-père Paternel' : 'Grand-père Maternel';
        } else {
          return isPaternal ? 'Grand-mère Paternelle' : 'Grand-mère Maternelle';
        }
      }
    }

    // Si c'est un frère/sœur
    const focalParents = focalPerson.parentIds || [];
    const targetParents = targetPerson.parentIds || [];
    const commonParents = focalParents.filter(id => targetParents.includes(id));
    
    if (commonParents.length > 0) {
      const gender = targetPerson.firstName;
      const isDemiSibling = commonParents.length < Math.max(focalParents.length, targetParents.length);
      
      
      if (gender === 'Paul' || gender === 'Jean' || gender === 'Lucas' || gender === 'Léo') {
        return isDemiSibling ? 'Demi-frère' : 'Frère';
      } else {
        return isDemiSibling ? 'Demi-sœur' : 'Sœur';
      }
    }

    // Si c'est un conjoint/partenaire
    const focalRelationships = focalPerson.relationships || [];
    const isSpouse = focalRelationships.some(r => r.partnerId === personId) || focalPerson.spouseId === personId;
    
    if (isSpouse) {
      const relationship = focalRelationships.find(r => r.partnerId === personId);
      const gender = targetPerson.firstName;
      
      if (relationship) {
        const status = relationship.status === 'current' ? 'Actuel(le)' : 'Ex';
        if (gender === 'Alex' || gender === 'Pierre' || gender === 'Marc' || gender === 'Kevin' || gender === 'Matteo') {
          return relationship.type === 'marriage' ? `${status === 'Actuel(le)' ? 'Époux' : 'Ex-époux'}` : `${status === 'Actuel(le)' ? 'Compagnon' : 'Ex-compagnon'}`;
        } else {
          return relationship.type === 'marriage' ? `${status === 'Actuel(le)' ? 'Épouse' : 'Ex-épouse'}` : `${status === 'Actuel(le)' ? 'Compagne' : 'Ex-compagne'}`;
        }
      }
    }

    // Si c'est un enfant
    if (focalPerson.childrenIds?.includes(personId)) {
      const gender = targetPerson.firstName;
      if (gender === 'Lucas' || gender === 'Léo' || gender === 'Hugo' || gender === 'Noah' || gender === 'Marco' || gender === 'Théo') {
        return 'Fils';
      } else {
        return 'Fille';
      }
    }

    // Si c'est un beau-fils/belle-fille (conjoint d'un enfant)
    const focalChildrenIds = focalPerson.childrenIds || [];
    for (const childId of focalChildrenIds) {
      const child = familyTreeData.people.find(p => p.id === childId);
      
      // Vérifier dans les deux sens : child.spouseId === personId OU targetPerson.spouseId === childId
      const isSpouseOfChild = (child?.spouseId === personId) || (targetPerson.spouseId === childId);
      
      if (isSpouseOfChild) {
        const gender = targetPerson.firstName;
        // Déterminer si c'est un gendre (mari de fille) ou belle-fille (épouse de fils)
        const childGender = child?.firstName || '';
        const isChildMale = ['Lucas', 'Léo', 'Thomas', 'Hugo', 'Noah'].includes(childGender);
        
        const relationshipType = isChildMale ? 'Belle-fille' : 'Gendre';
        return `${relationshipType} (conjoint de ${child?.firstName})`;
      }
    }

    // Si c'est un parent de petit-enfant (parent d'un petit-enfant qui n'est pas notre enfant)
    for (const childId of focalChildrenIds) {
      const child = familyTreeData.people.find(p => p.id === childId);
      const grandchildrenIds = child?.childrenIds || [];
      
      for (const grandchildId of grandchildrenIds) {
        const grandchild = familyTreeData.people.find(p => p.id === grandchildId);
        if (grandchild?.parentIds?.includes(personId) && personId !== childId) {
          // C'est l'autre parent d'un petit-enfant (pas notre enfant direct)
          const gender = targetPerson.firstName;
          if (gender === 'Anna' || gender === 'Sofia' || gender === 'Elena' || gender === 'Marie' || gender === 'Sarah') {
            return 'Parent de petit-enfant (Mère)';
          } else {
            return 'Parent de petit-enfant (Père)';
          }
        }
      }
    }

    // Recalculer la fratrie pour cette fonction
    const focalParentsForSiblings = focalPerson.parentIds || [];
    const focalSiblingIds = familyTreeData.people.filter(p => {
      if (p.id === focalPersonId) return false; // Exclure la personne elle-même
      const pParents = p.parentIds || [];
      return focalParentsForSiblings.some(parentId => pParents.includes(parentId));
    }).map(p => p.id);

    // Si c'est un conjoint de frère/sœur
    for (const siblingId of focalSiblingIds) {
      const sibling = familyTreeData.people.find(p => p.id === siblingId);
      if (sibling?.spouseId === personId) {
        const siblingGender = sibling.firstName;
        const isTargetMale = ['Alex', 'Pierre', 'Marc', 'Kevin', 'Matteo', 'Antoine'].includes(targetPerson.firstName);
        
        const relationshipType = isTargetMale ? 'Beau-frère' : 'Belle-sœur';
        return `${relationshipType} (conjoint de ${sibling.firstName})`;
      }
    }

    // Si c'est un neveu/nièce (enfant d'un frère/sœur)
    for (const siblingId of focalSiblingIds) {
      const sibling = familyTreeData.people.find(p => p.id === siblingId);
      if (sibling?.childrenIds?.includes(personId)) {
        const gender = targetPerson.firstName;
        const relationshipType = ['Thomas', 'Hugo', 'Noah', 'Marco', 'Théo', 'Antoine', 'Gabriel'].includes(gender) ? 'Neveu' : 'Nièce';
        return `${relationshipType} (fils/fille de ${sibling.firstName})`;
      }
    }

    // Si c'est un conjoint de neveu/nièce
    const nephewsNiecesIds = focalSiblingIds.flatMap(siblingId => {
      const sibling = familyTreeData.people.find(p => p.id === siblingId);
      return sibling?.childrenIds || [];
    });
    
    for (const nephewNieceId of nephewsNiecesIds) {
      const nephewNiece = familyTreeData.people.find(p => p.id === nephewNieceId);
      if (nephewNiece?.spouseId === personId) {
        const nephewNieceGender = nephewNiece.firstName;
        const isNephewNieceMale = ['Thomas', 'Hugo', 'Noah', 'Marco'].includes(nephewNieceGender);
        
        const relationshipType = isNephewNieceMale ? 'Conjoint de neveu' : 'Conjoint de nièce';
        return `${relationshipType} (conjoint de ${nephewNiece.firstName})`;
      }
    }

    // Si c'est un arrière-neveu/nièce (enfant d'un neveu/nièce)
    for (const nephewNieceId of nephewsNiecesIds) {
      const nephewNiece = familyTreeData.people.find(p => p.id === nephewNieceId);
      if (nephewNiece?.childrenIds?.includes(personId)) {
        const gender = targetPerson.firstName;
        const relationshipType = ['Antoine', 'Gabriel', 'Hugo', 'Noah'].includes(gender) ? 'Arrière-neveu' : 'Arrière-nièce';
        return `${relationshipType} (fils/fille de ${nephewNiece.firstName})`;
      }
    }

    // Si c'est un petit-enfant (enfant d'un enfant)
    for (const childId of focalChildrenIds) {
      const child = familyTreeData.people.find(p => p.id === childId);
      if (child?.childrenIds?.includes(personId)) {
        const gender = targetPerson.firstName;
        let relationshipType;
        if (gender === 'Hugo' || gender === 'Noah' || gender === 'Marco' || gender === 'Théo' || gender === 'Antoine' || gender === 'Gabriel') {
          relationshipType = 'Petit-fils';
        } else if (gender === 'Sofia' || gender === 'Elena' || gender === 'Zoé' || gender === 'Manon') {
          relationshipType = 'Petite-fille';
        } else {
          relationshipType = 'Petit-enfant';
        }
        return `${relationshipType} (fils/fille de ${child?.firstName})`;
      }
    }

    return targetPerson.firstName; // Nom par défaut
  };

  // Fonction pour obtenir la relation par rapport à l'utilisateur (rétrocompatibilité)
  const getRelationshipLabel = (personId: string): string => {
    return getRelationshipLabelFromPerspective(personId, focalPersonId);
  };

  // Fonction pour obtenir la relation par rapport à l'utilisateur (ancienne version)
  const getRelationshipLabelOld = (personId: string): string => {
    const relationships: { [key: string]: string } = {
      'father-001': 'Père',
      'mother-001': 'Mère',
      'grandfather-pat-001': 'Grand-père Paternel',
      'grandmother-pat-001': 'Grand-mère Paternelle',
      'grandfather-mat-001': 'Grand-père Maternel',
      'grandmother-mat-001': 'Grand-mère Maternelle',
      'spouse-001': 'Ex-épouse (2008-2015)',
      'spouse-002': 'Épouse Actuelle (2017-présent)',
      'sibling-001': 'Frère Aîné',
      'sibling-002': 'Sœur',
      'sibling-003': 'Sœur Cadette',
      'sibling-004': 'Demi-sœur (Paternelle)',
      'child-001': 'Fils (Jean)',
      'child-002': 'Fille (Ex-épouse)',
      'child-003': 'Fils (Épouse)',
      'child-004': 'Fille (Épouse)',
      'grandchild-001': 'Petit-fils',
      'nephew-001': 'Neveu (Fils de Paul)',
      'father-spouse-001': 'Beau-père (Père de Marie)',
      'mother-spouse-001': 'Belle-mère (Mère de Marie)',
      'mother-camille': 'Belle-mère (Mère de Camille)',
      'grandfather-camille-mat': 'Grand-père (Maternel de Camille)',
      'grandmother-camille-mat': 'Grand-mère (Maternelle de Camille)',
      // Conjoints des frères/sœurs
      'spouse-sibling-001': 'Belle-sœur (Épouse de Paul)',
      'spouse-sibling-002': 'Beau-frère (Époux de Marie-Claire)',
      'spouse-sibling-003': 'Beau-frère (Époux d\'Isabelle)',
      'spouse-sibling-004': 'Beau-frère (Époux de Camille)',
      // Enfants des frères/sœurs
      'niece-001': 'Nièce (Fille de Paul)',
      'nephew-002': 'Neveu (Fils de Marie-Claire)',
      'niece-002': 'Nièce (Fille de Marie-Claire)',
      'nephew-003': 'Neveu (Fils d\'Isabelle)',
      'niece-003': 'Nièce (Fille de Camille)',
      // Conjoints des enfants
      'spouse-child-001': 'Belle-fille (Épouse de Lucas)',
      'spouse-child-002': 'Gendre (Époux d\'Emma)',
      'spouse-child-003': 'Belle-fille (Épouse de Léo)',
      'spouse-child-004': 'Gendre (Époux de Chloé)',
      // Nouveaux petits-enfants
      'grandchild-002': 'Petite-fille (Fille de Lucas)',
      'grandchild-003': 'Petit-fils (Fils d\'Emma)',
      'grandchild-004': 'Petit-fils (Fils de Léo)',
      'grandchild-005': 'Petite-fille (Fille de Chloé)',
      'grandchild-006': 'Petit-fils (Fils de Chloé)',
      // Ex-partenaires
      'ex-partner-paul': 'Ex-compagne de Paul (2005-2008)',
    };
    return relationships[personId] || '';
  };

  // Famille principale (construite dynamiquement selon la perspective)
  const getMainFamilyGroups = () => {
    console.log('getMainFamilyGroups appelé pour focalPersonId:', focalPersonId);
    const result = buildTreeFromPerspective(focalPersonId) || {};
    console.log('Résultat getMainFamilyGroups:', result);
    return result;
  };

  // Positions individuelles pour la famille (simplifié)
  const getMainFamilyIndividualPositions = () => {
    // Plus de positions individuelles nécessaires avec le système de paquets
    return [];
  };

  // Connexions simplifiées (désactivées temporairement)
  const getMainFamilyConnections = () => {
    // Connexions désactivées pour se concentrer sur le positionnement
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
        {/* Toggle Vue Graphique/Liste */}
        <div style={{ 
          display: 'flex', 
          gap: '4px',
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: '8px',
          padding: '4px'
        }}>
          <button 
            onClick={() => setViewMode('graph')}
            style={{ 
              padding: '8px 12px', 
              backgroundColor: viewMode === 'graph' ? '#007EB9' : 'transparent', 
              color: viewMode === 'graph' ? 'white' : '#007EB9', 
              border: '1px solid #007EB9', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            🌳 Graphique
          </button>
          <button 
            onClick={() => setViewMode('list')}
            style={{ 
              padding: '8px 12px', 
              backgroundColor: viewMode === 'list' ? '#007EB9' : 'transparent', 
              color: viewMode === 'list' ? 'white' : '#007EB9', 
              border: '1px solid #007EB9', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            📋 Liste
          </button>
        </div>

        {/* Contrôles de zoom (seulement en mode graphique) */}
        {viewMode === 'graph' && (
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
        )}
        
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

      {/* Contenu principal selon le mode d'affichage */}
      {viewMode === 'graph' ? (
        /* Vue Graphique */
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
              {/* Arbre familial avec perspective dynamique */}
              <FamilyTreeFrame
                title={`Famille de ${familyTreeData.people.find(p => p.id === focalPersonId)?.firstName || 'Membre'}`}
                people={familyTreeData.people}
                stackedGroups={getMainFamilyGroups()}
                individualPositions={getMainFamilyIndividualPositions()}
                connections={getMainFamilyConnections()}
                onPersonClick={handlePersonClick}
                selectedPersonId={selectedPersonId}
                getRelationshipLabel={getRelationshipLabel}
                getParentType={getParentType}
                isActive={true}
                frameStyle={{ flex: 1 }}
              />

              {/* Bouton pour revenir à la vue de l'utilisateur principal */}
              {focalPersonId !== 'user-001' && (
                <button
                  style={{
                    position: 'absolute',
                    top: '80px',
                    right: '30px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    zIndex: 1001,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                  onClick={() => setFocalPersonId('user-001')}
                  title="Revenir à ma vue"
                >
                  🏠 Ma famille
                </button>
              )}
            </div>
          </TransformComponent>
        </TransformWrapper>
      ) : (
        /* Vue Liste */
        <FamilyListView
          people={familyTreeData.people}
          focalPersonId={focalPersonId}
          onPersonClick={handlePersonClick}
          getRelationshipLabel={getRelationshipLabelFromPerspective}
          buildTreeFromPerspective={buildTreeFromPerspective}
        />
      )}
    </div>
  );
};

export default AutoLayoutTree;