// Types pour l'arbre généalogique

export type RelationshipType = 
  | 'marriage'      // Mariage officiel
  | 'partnership'   // Union libre / PACS
  | 'relationship'  // Relation amoureuse
  | 'divorced'      // Divorcé(e)
  | 'separated'     // Séparé(e)
  | 'widowed'       // Veuf/Veuve
  | 'ended';        // Relation terminée

export type RelationshipStatus = 'current' | 'past';

export type ParentType = 
  | 'biological'    // Parent biologique
  | 'adoptive'      // Parent adoptif
  | 'step'          // Beau-parent
  | 'foster'        // Famille d'accueil
  | 'guardian';     // Tuteur légal

export interface ParentRelationship {
  parentId: string;
  type: ParentType;
  isLegal?: boolean; // Reconnaissance légale
  adoptionDate?: string; // Date d'adoption si applicable
}

export interface PersonRelationship {
  partnerId: string;
  type: RelationshipType;
  status: RelationshipStatus;
  startDate?: string; // Date approximative de début
  endDate?: string;   // Date de fin si applicable
  hasChildren?: boolean; // A eu des enfants ensemble
  isLegalUnion?: boolean; // Union légale (mariage, PACS)
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  maidenName?: string; // Nom de jeune fille
  birthDate?: string; // Format ISO: "1990-05-15"
  deathDate?: string; // Format ISO, undefined si vivant
  birthPlace?: string;
  avatar?: string; // URL de l'image
  isCurrentUser?: boolean; // True pour l'utilisateur connecté
  
  // Relations familiales
  relationships?: PersonRelationship[]; // Relations amoureuses chronologiques
  spouseId?: string; // Conjoint actuel (rétrocompatibilité)
  exSpouseIds?: string[]; // Ex-conjoints (rétrocompatibilité)
  parentIds?: string[]; // Parents [père, mère] ou [parent1, parent2] (rétrocompatibilité)
  parentRelationships?: ParentRelationship[]; // Relations parentales détaillées
  childrenIds?: string[]; // Enfants
  
  // Informations supplémentaires
  occupation?: string;
  bio?: string;
  
  // Métadonnées pour l'affichage
  position?: TreePosition;
  generation?: number; // 0 = utilisateur, -1 = parents, +1 = enfants
}

export interface TreePosition {
  x: number;
  y: number;
  generation: number;
  familyBranch: 'paternal' | 'maternal' | 'spouse' | 'children' | 'current';
}

export interface FamilyConnection {
  id: string;
  type: 'parent-child' | 'spouse' | 'sibling';
  person1Id: string;
  person2Id: string;
  startDate?: string; // Pour les mariages
  endDate?: string; // Pour les divorces
}

export interface FamilyTree {
  people: Person[];
  connections: FamilyConnection[];
  currentUserId: string;
  metadata: {
    title: string;
    description?: string;
    lastUpdated: string;
    generationsUp: number; // Nombre de générations affichées vers le haut
    generationsDown: number; // Nombre de générations affichées vers le bas
  };
}

// Types pour les composants UI
export interface PersonCardProps {
  person: Person;
  size?: 'small' | 'medium' | 'large';
  onClick?: (person: Person) => void;
  isSelected?: boolean;
  isHighlighted?: boolean;
}

export interface TreeViewport {
  x: number;
  y: number;
  scale: number;
  width: number;
  height: number;
}

export interface TreeLayoutConfig {
  cardWidth: number;
  cardHeight: number;
  horizontalSpacing: number;
  verticalSpacing: number;
  generationHeight: number;
}

// Utilitaires de type
export type PersonWithRelations = Person & {
  spouse?: Person;
  parents?: Person[];
  children?: Person[];
  siblings?: Person[];
};

export type GenerationMap = Map<number, Person[]>;