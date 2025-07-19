import { ParentType, ParentRelationship } from '@/types/family';

/**
 * Couleurs pour les différents types de parenté
 */
export const PARENT_TYPE_COLORS = {
  biological: '#4CAF50',   // Vert - parent biologique
  adoptive: '#2196F3',     // Bleu - parent adoptif
  step: '#FF9800',         // Orange - beau-parent
  foster: '#9C27B0',       // Violet - famille d'accueil
  guardian: '#607D8B'      // Gris-bleu - tuteur
} as const;

/**
 * Labels pour les types de parenté
 */
export const PARENT_TYPE_LABELS = {
  biological: 'Bio',
  adoptive: 'Adoptif',
  step: 'Beau',
  foster: 'Accueil',
  guardian: 'Tuteur'
} as const;

/**
 * Obtient la couleur pour un type de parent
 */
export function getParentTypeColor(parentType: ParentType): string {
  return PARENT_TYPE_COLORS[parentType] || PARENT_TYPE_COLORS.biological;
}

/**
 * Obtient le label court pour un type de parent
 */
export function getParentTypeLabel(parentType: ParentType): string {
  return PARENT_TYPE_LABELS[parentType] || 'Parent';
}

/**
 * Obtient le label complet avec détails
 */
export function getDetailedParentLabel(
  parentType: ParentType, 
  isLegal?: boolean, 
  adoptionDate?: string
): string {
  const baseLabels = {
    biological: 'Parent Biologique',
    adoptive: 'Parent Adoptif',
    step: 'Beau-parent',
    foster: 'Famille d\'Accueil',
    guardian: 'Tuteur Légal'
  };

  let label = baseLabels[parentType];
  
  if (parentType === 'adoptive' && adoptionDate) {
    const year = new Date(adoptionDate).getFullYear();
    label += ` (${year})`;
  }
  
  if (isLegal === false && parentType !== 'biological') {
    label += ' (Non-légal)';
  }

  return label;
}

/**
 * Analyse les relations parentales pour créer des groupes
 */
export function groupParentsByType(parentRelationships: ParentRelationship[]): {
  [key in ParentType]?: ParentRelationship[]
} {
  const groups: { [key in ParentType]?: ParentRelationship[] } = {};
  
  parentRelationships.forEach(rel => {
    if (!groups[rel.type]) {
      groups[rel.type] = [];
    }
    groups[rel.type]!.push(rel);
  });

  return groups;
}

/**
 * Détermine l'ordre de priorité des types de parents pour l'affichage
 */
export function sortParentTypes(types: ParentType[]): ParentType[] {
  const priority: ParentType[] = ['biological', 'adoptive', 'step', 'guardian', 'foster'];
  
  return types.sort((a, b) => {
    const indexA = priority.indexOf(a);
    const indexB = priority.indexOf(b);
    return indexA - indexB;
  });
}

/**
 * Crée un label de relation avec code couleur pour l'affichage
 */
export function createColoredParentLabel(
  relationshipType: string, // Ex: "Père", "Mère", "Grand-père"
  parentType: ParentType
): {
  text: string;
  color: string;
  fullLabel: string;
} {
  const typeLabel = getParentTypeLabel(parentType);
  const color = getParentTypeColor(parentType);
  
  return {
    text: `${relationshipType} (${typeLabel})`,
    color,
    fullLabel: `${relationshipType} ${getDetailedParentLabel(parentType)}`
  };
}