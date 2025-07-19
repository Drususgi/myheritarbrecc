import { Person, PersonRelationship } from '@/types/family';

/**
 * Obtient tous les partenaires d'une personne, triés par chronologie
 * Le partenaire actuel est en premier (dessus de la pile)
 */
export function getOrderedPartners(person: Person, allPeople: Person[]): Person[] {
  if (!person.relationships || person.relationships.length === 0) {
    return [];
  }

  // Trier les relations : actuelle en premier, puis par date de début (plus récent en premier)
  const sortedRelationships = [...person.relationships].sort((a, b) => {
    // Relations actuelles en premier
    if (a.status === 'current' && b.status === 'past') return -1;
    if (a.status === 'past' && b.status === 'current') return 1;
    
    // Si même statut, trier par date de début (plus récent en premier)
    if (a.startDate && b.startDate) {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    }
    
    return 0;
  });

  // Récupérer les personnes correspondantes
  return sortedRelationships
    .map(rel => allPeople.find(p => p.id === rel.partnerId))
    .filter(Boolean) as Person[];
}

/**
 * Obtient le label de relation basé sur le type et le statut
 */
export function getRelationshipLabel(relationship: PersonRelationship, person: Person): string {
  const labels: { [key: string]: string } = {
    'marriage-current': 'Époux/Épouse',
    'marriage-past': 'Ex-Époux/Épouse',
    'divorced-past': 'Ex-Époux/Épouse (Divorcé)',
    'partnership-current': 'Partenaire (PACS)',
    'partnership-past': 'Ex-Partenaire (PACS)',
    'relationship-current': 'Compagnon/Compagne',
    'relationship-past': 'Ex-Compagnon/Compagne',
    'separated-past': 'Séparé(e)',
    'widowed-past': 'Veuf/Veuve',
    'ended-past': 'Ex-Partenaire'
  };

  const key = `${relationship.type}-${relationship.status}`;
  return labels[key] || 'Partenaire';
}

/**
 * Détermine si une relation doit être affichée avec un style spécial
 */
export function getRelationshipStyle(relationship: PersonRelationship): {
  isLegal: boolean;
  isCurrent: boolean;
  hasChildren: boolean;
} {
  return {
    isLegal: relationship.isLegalUnion || false,
    isCurrent: relationship.status === 'current',
    hasChildren: relationship.hasChildren || false
  };
}

/**
 * Calcule la durée d'une relation
 */
export function getRelationshipDuration(relationship: PersonRelationship): string {
  if (!relationship.startDate) return '';
  
  const start = new Date(relationship.startDate);
  const end = relationship.endDate ? new Date(relationship.endDate) : new Date();
  
  const years = Math.floor((end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  
  if (years < 1) return 'Moins d\'un an';
  if (years === 1) return '1 an';
  return `${years} ans`;
}

/**
 * Obtient l'ordre pour l'affichage dans les piles (0 = dessus)
 */
export function getStackOrder(relationships: PersonRelationship[]): { [partnerId: string]: number } {
  const ordered = relationships
    .slice()
    .sort((a, b) => {
      // Relations actuelles en premier
      if (a.status === 'current' && b.status === 'past') return -1;
      if (a.status === 'past' && b.status === 'current') return 1;
      
      // Par date de début (plus récent en premier)
      if (a.startDate && b.startDate) {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
      
      return 0;
    });

  const stackOrder: { [partnerId: string]: number } = {};
  ordered.forEach((rel, index) => {
    stackOrder[rel.partnerId] = index;
  });

  return stackOrder;
}