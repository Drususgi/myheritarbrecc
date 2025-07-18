import { Person, FamilyTree, FamilyConnection } from '@/types/family';

// Données de test : famille complète sur 4 générations
export const familyMembers: Person[] = [
  // === GÉNÉRATION 0 : UTILISATEUR CONNECTÉ ===
  {
    id: 'user-001',
    firstName: 'Jean',
    lastName: 'Martin',
    birthDate: '1985-03-15',
    birthPlace: 'Paris, France',
    // avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isCurrentUser: true,
    spouseId: 'spouse-001',
    parentIds: ['father-001', 'mother-001'],
    childrenIds: ['child-001', 'child-002', 'child-003', 'child-004'],
    occupation: 'Ingénieur logiciel',
    bio: 'Passionné de généalogie et de technologie',
    generation: 0,
  },
  
  // === CONJOINTES ===
  {
    id: 'spouse-001',
    firstName: 'Marie',
    lastName: 'Martin',
    maidenName: 'Dubois',
    birthDate: '1987-08-22',
    birthPlace: 'Lyon, France',
    // avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b550?w=150&h=150&fit=crop&crop=face',
    spouseId: 'user-001',
    parentIds: ['father-spouse-001', 'mother-spouse-001'],
    childrenIds: ['child-001', 'child-002'],
    occupation: 'Médecin',
    generation: 0,
  },
  {
    id: 'spouse-002',
    firstName: 'Sarah',
    lastName: 'Martin',
    maidenName: 'Lefebvre',
    birthDate: '1990-05-12',
    birthPlace: 'Marseille, France',
    spouseId: 'user-001',
    childrenIds: ['child-003', 'child-004'],
    occupation: 'Avocate',
    generation: 0,
  },

  // === GÉNÉRATION +1 : ENFANTS ===
  {
    id: 'child-001',
    firstName: 'Lucas',
    lastName: 'Martin',
    birthDate: '2010-12-05',
    birthPlace: 'Paris, France',
    // avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    parentIds: ['user-001', 'spouse-001'],
    childrenIds: ['grandchild-001'],
    generation: 1,
  },
  {
    id: 'child-002',
    firstName: 'Emma',
    lastName: 'Martin',
    birthDate: '2013-04-18',
    birthPlace: 'Paris, France',
    // avatar: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=150&h=150&fit=crop&crop=face',
    parentIds: ['user-001', 'spouse-001'],
    generation: 1,
  },
  {
    id: 'child-003',
    firstName: 'Léo',
    lastName: 'Martin',
    birthDate: '2018-09-10',
    birthPlace: 'Paris, France',
    parentIds: ['user-001', 'spouse-002'],
    generation: 1,
  },
  {
    id: 'child-004',
    firstName: 'Chloé',
    lastName: 'Martin',
    birthDate: '2020-12-03',
    birthPlace: 'Paris, France',
    parentIds: ['user-001', 'spouse-002'],
    generation: 1,
  },

  // === GÉNÉRATION +2 : PETITS-ENFANTS ===
  {
    id: 'grandchild-001',
    firstName: 'Hugo',
    lastName: 'Martin',
    birthDate: '2035-07-10',
    birthPlace: 'Paris, France',
    // avatar: 'https://images.unsplash.com/photo-1503919436723-4d7a26369ad9?w=150&h=150&fit=crop&crop=face',
    parentIds: ['child-001'],
    generation: 2,
  },

  // === GÉNÉRATION -1 : PARENTS ===
  {
    id: 'father-001',
    firstName: 'Pierre',
    lastName: 'Martin',
    birthDate: '1955-09-12',
    birthPlace: 'Marseille, France',
    // avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    spouseId: 'mother-001',
    parentIds: ['grandfather-pat-001', 'grandmother-pat-001'],
    childrenIds: ['user-001', 'sibling-001', 'sibling-002', 'sibling-003'],
    occupation: 'Professeur',
    generation: -1,
  },
  {
    id: 'mother-001',
    firstName: 'Sophie',
    lastName: 'Martin',
    maidenName: 'Leroy',
    birthDate: '1958-01-25',
    birthPlace: 'Bordeaux, France',
    // avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    spouseId: 'father-001',
    parentIds: ['grandfather-mat-001', 'grandmother-mat-001'],
    childrenIds: ['user-001', 'sibling-001', 'sibling-002', 'sibling-003'],
    occupation: 'Infirmière',
    generation: -1,
  },

  // === PARENTS DE LA CONJOINTE ===
  {
    id: 'father-spouse-001',
    firstName: 'Michel',
    lastName: 'Dubois',
    birthDate: '1960-06-18',
    birthPlace: 'Toulouse, France',
    // avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    spouseId: 'mother-spouse-001',
    childrenIds: ['spouse-001'],
    occupation: 'Architecte',
    generation: -1,
  },
  {
    id: 'mother-spouse-001',
    firstName: 'Catherine',
    lastName: 'Dubois',
    maidenName: 'Rousseau',
    birthDate: '1962-11-30',
    birthPlace: 'Nice, France',
    // avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    spouseId: 'father-spouse-001',
    childrenIds: ['spouse-001'],
    occupation: 'Comptable',
    generation: -1,
  },

  // === FRÈRES ET SŒURS ===
  {
    id: 'sibling-001',
    firstName: 'Paul',
    lastName: 'Martin',
    birthDate: '1983-07-08',
    birthPlace: 'Paris, France',
    // avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    parentIds: ['father-001', 'mother-001'],
    childrenIds: ['nephew-001'],
    occupation: 'Avocat',
    generation: 0,
  },
  {
    id: 'sibling-002',
    firstName: 'Marie-Claire',
    lastName: 'Martin',
    birthDate: '1980-11-15',
    birthPlace: 'Paris, France',
    parentIds: ['father-001', 'mother-001'],
    occupation: 'Professeure',
    generation: 0,
  },
  {
    id: 'sibling-003',
    firstName: 'Isabelle',
    lastName: 'Martin',
    birthDate: '1987-04-22',
    birthPlace: 'Paris, France',
    parentIds: ['father-001', 'mother-001'],
    occupation: 'Architecte',
    generation: 0,
  },
  {
    id: 'nephew-001',
    firstName: 'Thomas',
    lastName: 'Martin',
    birthDate: '2015-02-14',
    birthPlace: 'Lyon, France',
    // avatar: 'https://images.unsplash.com/photo-1519946816731-bb4b2b6b200c?w=150&h=150&fit=crop&crop=face',
    parentIds: ['sibling-001'],
    generation: 1,
  },

  // === GÉNÉRATION -2 : GRANDS-PARENTS PATERNELS ===
  {
    id: 'grandfather-pat-001',
    firstName: 'Henri',
    lastName: 'Martin',
    birthDate: '1925-04-03',
    deathDate: '2010-12-15',
    birthPlace: 'Lille, France',
    // avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    spouseId: 'grandmother-pat-001',
    childrenIds: ['father-001'],
    occupation: 'Fermier',
    generation: -2,
  },
  {
    id: 'grandmother-pat-001',
    firstName: 'Marguerite',
    lastName: 'Martin',
    maidenName: 'Moreau',
    birthDate: '1928-10-20',
    deathDate: '2015-05-08',
    birthPlace: 'Amiens, France',
    // avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    spouseId: 'grandfather-pat-001',
    childrenIds: ['father-001'],
    occupation: 'Institutrice',
    generation: -2,
  },

  // === GÉNÉRATION -2 : GRANDS-PARENTS MATERNELS ===
  {
    id: 'grandfather-mat-001',
    firstName: 'Robert',
    lastName: 'Leroy',
    birthDate: '1930-08-14',
    deathDate: '2018-03-22',
    birthPlace: 'Nantes, France',
    // avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    spouseId: 'grandmother-mat-001',
    childrenIds: ['mother-001'],
    occupation: 'Mécanicien',
    generation: -2,
  },
  {
    id: 'grandmother-mat-001',
    firstName: 'Jeanne',
    lastName: 'Leroy',
    maidenName: 'Bernard',
    birthDate: '1932-12-07',
    birthPlace: 'Rennes, France',
    // avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    spouseId: 'grandfather-mat-001',
    childrenIds: ['mother-001'],
    occupation: 'Couturière',
    generation: -2,
  },
];

// Connexions familiales
export const familyConnections: FamilyConnection[] = [
  // Mariages
  { id: 'conn-001', type: 'spouse', person1Id: 'user-001', person2Id: 'spouse-001', startDate: '2008-06-15' },
  { id: 'conn-043', type: 'spouse', person1Id: 'user-001', person2Id: 'spouse-002', startDate: '2017-09-20' },
  { id: 'conn-002', type: 'spouse', person1Id: 'father-001', person2Id: 'mother-001', startDate: '1980-05-12' },
  { id: 'conn-003', type: 'spouse', person1Id: 'father-spouse-001', person2Id: 'mother-spouse-001', startDate: '1985-09-20' },
  { id: 'conn-004', type: 'spouse', person1Id: 'grandfather-pat-001', person2Id: 'grandmother-pat-001', startDate: '1950-07-10' },
  { id: 'conn-005', type: 'spouse', person1Id: 'grandfather-mat-001', person2Id: 'grandmother-mat-001', startDate: '1952-04-18' },

  // Relations parent-enfant
  { id: 'conn-006', type: 'parent-child', person1Id: 'father-001', person2Id: 'user-001' },
  { id: 'conn-007', type: 'parent-child', person1Id: 'mother-001', person2Id: 'user-001' },
  { id: 'conn-008', type: 'parent-child', person1Id: 'father-001', person2Id: 'sibling-001' },
  { id: 'conn-009', type: 'parent-child', person1Id: 'mother-001', person2Id: 'sibling-001' },
  { id: 'conn-025', type: 'parent-child', person1Id: 'father-001', person2Id: 'sibling-002' },
  { id: 'conn-026', type: 'parent-child', person1Id: 'mother-001', person2Id: 'sibling-002' },
  { id: 'conn-027', type: 'parent-child', person1Id: 'father-001', person2Id: 'sibling-003' },
  { id: 'conn-028', type: 'parent-child', person1Id: 'mother-001', person2Id: 'sibling-003' },
  { id: 'conn-010', type: 'parent-child', person1Id: 'user-001', person2Id: 'child-001' },
  { id: 'conn-011', type: 'parent-child', person1Id: 'spouse-001', person2Id: 'child-001' },
  { id: 'conn-012', type: 'parent-child', person1Id: 'user-001', person2Id: 'child-002' },
  { id: 'conn-013', type: 'parent-child', person1Id: 'spouse-001', person2Id: 'child-002' },
  { id: 'conn-034', type: 'parent-child', person1Id: 'user-001', person2Id: 'child-003' },
  { id: 'conn-035', type: 'parent-child', person1Id: 'spouse-002', person2Id: 'child-003' },
  { id: 'conn-036', type: 'parent-child', person1Id: 'user-001', person2Id: 'child-004' },
  { id: 'conn-037', type: 'parent-child', person1Id: 'spouse-002', person2Id: 'child-004' },
  { id: 'conn-014', type: 'parent-child', person1Id: 'child-001', person2Id: 'grandchild-001' },
  { id: 'conn-015', type: 'parent-child', person1Id: 'sibling-001', person2Id: 'nephew-001' },
  
  // Grands-parents
  { id: 'conn-016', type: 'parent-child', person1Id: 'grandfather-pat-001', person2Id: 'father-001' },
  { id: 'conn-017', type: 'parent-child', person1Id: 'grandmother-pat-001', person2Id: 'father-001' },
  { id: 'conn-018', type: 'parent-child', person1Id: 'grandfather-mat-001', person2Id: 'mother-001' },
  { id: 'conn-019', type: 'parent-child', person1Id: 'grandmother-mat-001', person2Id: 'mother-001' },
  { id: 'conn-020', type: 'parent-child', person1Id: 'father-spouse-001', person2Id: 'spouse-001' },
  { id: 'conn-021', type: 'parent-child', person1Id: 'mother-spouse-001', person2Id: 'spouse-001' },

  // Fratries
  { id: 'conn-022', type: 'sibling', person1Id: 'user-001', person2Id: 'sibling-001' },
  { id: 'conn-029', type: 'sibling', person1Id: 'user-001', person2Id: 'sibling-002' },
  { id: 'conn-030', type: 'sibling', person1Id: 'user-001', person2Id: 'sibling-003' },
  { id: 'conn-031', type: 'sibling', person1Id: 'sibling-001', person2Id: 'sibling-002' },
  { id: 'conn-032', type: 'sibling', person1Id: 'sibling-001', person2Id: 'sibling-003' },
  { id: 'conn-033', type: 'sibling', person1Id: 'sibling-002', person2Id: 'sibling-003' },
  { id: 'conn-023', type: 'sibling', person1Id: 'child-001', person2Id: 'child-002' },
  { id: 'conn-038', type: 'sibling', person1Id: 'child-001', person2Id: 'child-003' },
  { id: 'conn-039', type: 'sibling', person1Id: 'child-001', person2Id: 'child-004' },
  { id: 'conn-040', type: 'sibling', person1Id: 'child-002', person2Id: 'child-003' },
  { id: 'conn-041', type: 'sibling', person1Id: 'child-002', person2Id: 'child-004' },
  { id: 'conn-042', type: 'sibling', person1Id: 'child-003', person2Id: 'child-004' },
];

// Arbre complet
export const familyTreeData: FamilyTree = {
  people: familyMembers,
  connections: familyConnections,
  currentUserId: 'user-001',
  metadata: {
    title: 'Famille Martin',
    description: 'Arbre généalogique de la famille Martin',
    lastUpdated: '2024-01-15',
    generationsUp: 2,
    generationsDown: 2,
  },
};

// Fonction utilitaire pour obtenir une personne par ID
export const getPersonById = (id: string): Person | undefined => {
  return familyMembers.find(person => person.id === id);
};

// Fonction utilitaire pour obtenir les enfants d'une personne
export const getChildren = (personId: string): Person[] => {
  const person = getPersonById(personId);
  if (!person?.childrenIds) return [];
  return person.childrenIds.map(id => getPersonById(id)).filter(Boolean) as Person[];
};

// Fonction utilitaire pour obtenir les parents d'une personne
export const getParents = (personId: string): Person[] => {
  const person = getPersonById(personId);
  if (!person?.parentIds) return [];
  return person.parentIds.map(id => getPersonById(id)).filter(Boolean) as Person[];
};