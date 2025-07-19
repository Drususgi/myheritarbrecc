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
    relationships: [
      {
        partnerId: 'spouse-001',
        type: 'divorced',
        status: 'past',
        startDate: '2008-06-15',
        endDate: '2015-03-10',
        hasChildren: true,
        isLegalUnion: true
      },
      {
        partnerId: 'spouse-002',
        type: 'marriage',
        status: 'current',
        startDate: '2017-09-20',
        hasChildren: true,
        isLegalUnion: true
      }
    ],
    spouseId: 'spouse-002', // Rétrocompatibilité - épouse actuelle
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
    parentIds: ['father-sarah', 'mother-sarah'],
    childrenIds: ['child-003', 'child-004'],
    occupation: 'Avocate',
    generation: 0,
  },

  // === GÉNÉRATION +1 : ENFANTS ===
  {
    id: 'child-001',
    firstName: 'Lucas',
    lastName: 'Martin',
    birthDate: '2009-12-05',
    birthPlace: 'Paris, France',
    // avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    parentIds: ['user-001', 'spouse-001'],
    spouseId: 'spouse-child-001',
    childrenIds: ['grandchild-001', 'grandchild-002'],
    occupation: 'Étudiant en Ingénierie',
    generation: 1,
  },
  {
    id: 'child-002',
    firstName: 'Emma',
    lastName: 'Martin',
    birthDate: '2011-04-18',
    birthPlace: 'Paris, France',
    // avatar: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=150&h=150&fit=crop&crop=face',
    parentIds: ['user-001', 'spouse-001'],
    spouseId: 'spouse-child-002',
    childrenIds: ['grandchild-003'],
    occupation: 'Étudiante en Médecine',
    generation: 1,
  },
  {
    id: 'child-003',
    firstName: 'Léo',
    lastName: 'Martin',
    birthDate: '2019-09-10',
    birthPlace: 'Paris, France',
    parentIds: ['user-001', 'spouse-002'],
    occupation: 'Lycéen',
    generation: 1,
  },
  {
    id: 'child-004',
    firstName: 'Chloé',
    lastName: 'Martin',
    birthDate: '2021-12-03',
    birthPlace: 'Paris, France',
    parentIds: ['user-001', 'spouse-002'],
    occupation: 'Collégienne',
    generation: 1,
  },

  // === GÉNÉRATION +2 : PETITS-ENFANTS ===
  {
    id: 'grandchild-001',
    firstName: 'Hugo',
    lastName: 'Martin',
    birthDate: '2023-07-10',
    birthPlace: 'Paris, France',
    // avatar: 'https://images.unsplash.com/photo-1503919436723-4d7a26369ad9?w=150&h=150&fit=crop&crop=face',
    parentIds: ['child-001', 'spouse-child-001'],
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
    childrenIds: ['user-001', 'sibling-001', 'sibling-002', 'sibling-003', 'sibling-004'],
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
    relationships: [
      {
        partnerId: 'ex-partner-paul',
        type: 'relationship',
        status: 'past',
        startDate: '2005-03-20',
        endDate: '2008-11-15',
        hasChildren: true,
        isLegalUnion: false
      },
      {
        partnerId: 'spouse-sibling-001',
        type: 'marriage',
        status: 'current',
        startDate: '2010-06-12',
        hasChildren: true,
        isLegalUnion: true
      }
    ],
    spouseId: 'spouse-sibling-001',
    childrenIds: ['nephew-001', 'niece-001'],
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
    spouseId: 'spouse-sibling-002',
    childrenIds: ['nephew-002', 'niece-002'],
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
    spouseId: 'spouse-sibling-003',
    childrenIds: ['nephew-003'],
    occupation: 'Architecte',
    generation: 0,
  },
  {
    id: 'sibling-004',
    firstName: 'Camille',
    lastName: 'Martin',
    birthDate: '1992-09-18',
    birthPlace: 'Paris, France',
    parentIds: ['father-001', 'mother-camille'], // Demi-sœur paternelle (père commun, mère différente)
    spouseId: 'spouse-sibling-004',
    childrenIds: ['niece-003'],
    occupation: 'Designer',
    generation: 0,
  },
  {
    id: 'nephew-001',
    firstName: 'Thomas',
    lastName: 'Martin',
    birthDate: '2015-02-14',
    birthPlace: 'Lyon, France',
    // avatar: 'https://images.unsplash.com/photo-1519946816731-bb4b2b6b200c?w=150&h=150&fit=crop&crop=face',
    parentIds: ['sibling-001', 'ex-partner-paul'], // Fils de Paul et Céline
    spouseId: 'spouse-thomas',
    childrenIds: ['great-nephew-001'],
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

  // === FAMILLES DES FRÈRES ET SŒURS ===
  
  // Ex-partenaire de Paul (relation avant mariage)
  {
    id: 'ex-partner-paul',
    firstName: 'Céline',
    lastName: 'Morel',
    birthDate: '1984-11-18',
    birthPlace: 'Nancy, France',
    parentIds: ['father-celine', 'mother-celine'],
    childrenIds: ['nephew-001'], // Thomas est son fils
    occupation: 'Journaliste',
    generation: 0,
  },

  // Conjoint de Paul (sibling-001)
  {
    id: 'spouse-sibling-001',
    firstName: 'Julie',
    lastName: 'Martin',
    maidenName: 'Dupont',
    birthDate: '1985-03-20',
    birthPlace: 'Lyon, France',
    spouseId: 'sibling-001',
    parentIds: ['father-julie', 'mother-julie'],
    childrenIds: ['niece-001'], // Sophie est sa fille
    occupation: 'Médecin',
    generation: 0,
  },
  
  // Enfant supplémentaire de Paul
  {
    id: 'niece-001',
    firstName: 'Sophie',
    lastName: 'Martin',
    birthDate: '2018-06-10',
    birthPlace: 'Lyon, France',
    parentIds: ['sibling-001', 'spouse-sibling-001'],
    spouseId: 'spouse-sophie',
    childrenIds: ['great-niece-001'],
    generation: 1,
  },

  // Conjoint de Marie-Claire (sibling-002)
  {
    id: 'spouse-sibling-002',
    firstName: 'Pierre',
    lastName: 'Dubois',
    birthDate: '1978-11-05',
    birthPlace: 'Marseille, France',
    spouseId: 'sibling-002',
    parentIds: ['father-pierre', 'mother-pierre'],
    childrenIds: ['nephew-002', 'niece-002'],
    occupation: 'Ingénieur',
    generation: 0,
  },

  // Enfants de Marie-Claire
  {
    id: 'nephew-002',
    firstName: 'Lucas',
    lastName: 'Dubois',
    birthDate: '2012-04-15',
    birthPlace: 'Marseille, France',
    parentIds: ['sibling-002', 'spouse-sibling-002'],
    spouseId: 'spouse-lucas-dubois',
    childrenIds: ['great-nephew-002'],
    generation: 1,
  },
  {
    id: 'niece-002',
    firstName: 'Emma',
    lastName: 'Dubois',
    birthDate: '2014-08-22',
    birthPlace: 'Marseille, France',
    parentIds: ['sibling-002', 'spouse-sibling-002'],
    spouseId: 'spouse-emma-dubois',
    childrenIds: ['great-niece-002'],
    generation: 1,
  },

  // Conjoint d'Isabelle (sibling-003)
  {
    id: 'spouse-sibling-003',
    firstName: 'Marc',
    lastName: 'Lefebvre',
    birthDate: '1984-07-12',
    birthPlace: 'Toulouse, France',
    spouseId: 'sibling-003',
    parentIds: ['father-marc', 'mother-marc'],
    childrenIds: ['nephew-003'],
    occupation: 'Architecte',
    generation: 0,
  },

  // Enfant d'Isabelle
  {
    id: 'nephew-003',
    firstName: 'Hugo',
    lastName: 'Lefebvre',
    birthDate: '2020-01-30',
    birthPlace: 'Toulouse, France',
    parentIds: ['sibling-003', 'spouse-sibling-003'],
    generation: 1,
  },

  // Conjoint de la demi-sœur Camille (sibling-004)
  {
    id: 'spouse-sibling-004',
    firstName: 'Alex',
    lastName: 'Martin',
    birthDate: '1990-12-08',
    birthPlace: 'Nice, France',
    spouseId: 'sibling-004',
    parentIds: ['father-alex', 'mother-alex'],
    childrenIds: ['niece-003'],
    occupation: 'Graphiste',
    generation: 0,
  },

  // Enfant de Camille
  {
    id: 'niece-003',
    firstName: 'Léa',
    lastName: 'Martin',
    birthDate: '2022-05-18',
    birthPlace: 'Nice, France',
    parentIds: ['sibling-004', 'spouse-sibling-004'],
    generation: 1,
  },

  // === FAMILLE MATERNELLE DE LA DEMI-SŒUR CAMILLE ===
  
  // Mère de Camille (deuxième épouse du père)
  {
    id: 'mother-camille',
    firstName: 'Sylvie',
    lastName: 'Martin',
    maidenName: 'Moreau',
    birthDate: '1970-03-25',
    birthPlace: 'Nantes, France',
    spouseId: 'father-001', // Deuxième épouse du père
    parentIds: ['grandfather-camille-mat', 'grandmother-camille-mat'],
    childrenIds: ['sibling-004'],
    occupation: 'Psychologue',
    generation: -1,
  },

  // Grands-parents maternels de Camille
  {
    id: 'grandfather-camille-mat',
    firstName: 'René',
    lastName: 'Moreau',
    birthDate: '1945-08-12',
    birthPlace: 'Nantes, France',
    spouseId: 'grandmother-camille-mat',
    childrenIds: ['mother-camille'],
    occupation: 'Mécanicien',
    generation: -2,
  },
  {
    id: 'grandmother-camille-mat',
    firstName: 'Françoise',
    lastName: 'Moreau',
    maidenName: 'Petit',
    birthDate: '1948-11-20',
    birthPlace: 'Angers, France',
    spouseId: 'grandfather-camille-mat',
    childrenIds: ['mother-camille'],
    occupation: 'Secrétaire',
    generation: -2,
  },

  // === PARENTS DES CONJOINTS DES FRÈRES/SŒURS ===
  
  // Parents de Julie (épouse de Paul)
  {
    id: 'father-julie',
    firstName: 'Bernard',
    lastName: 'Dupont',
    birthDate: '1960-05-15',
    birthPlace: 'Strasbourg, France',
    spouseId: 'mother-julie',
    childrenIds: ['spouse-sibling-001'],
    occupation: 'Comptable',
    generation: -1,
  },
  {
    id: 'mother-julie',
    firstName: 'Monique',
    lastName: 'Dupont',
    maidenName: 'Blanc',
    birthDate: '1962-09-08',
    birthPlace: 'Metz, France',
    spouseId: 'father-julie',
    childrenIds: ['spouse-sibling-001'],
    occupation: 'Enseignante',
    generation: -1,
  },

  // Parents de Pierre (époux de Marie-Claire)
  {
    id: 'father-pierre',
    firstName: 'André',
    lastName: 'Dubois',
    birthDate: '1955-12-03',
    birthPlace: 'Bordeaux, France',
    spouseId: 'mother-pierre',
    childrenIds: ['spouse-sibling-002'],
    occupation: 'Pharmacien',
    generation: -1,
  },
  {
    id: 'mother-pierre',
    firstName: 'Claire',
    lastName: 'Dubois',
    maidenName: 'Roux',
    birthDate: '1958-07-18',
    birthPlace: 'Pau, France',
    spouseId: 'father-pierre',
    childrenIds: ['spouse-sibling-002'],
    occupation: 'Bibliothécaire',
    generation: -1,
  },

  // Parents de Marc (époux d'Isabelle)
  {
    id: 'father-marc',
    firstName: 'Philippe',
    lastName: 'Lefebvre',
    birthDate: '1957-02-28',
    birthPlace: 'Montpellier, France',
    spouseId: 'mother-marc',
    childrenIds: ['spouse-sibling-003'],
    occupation: 'Architecte',
    generation: -1,
  },
  {
    id: 'mother-marc',
    firstName: 'Isabelle',
    lastName: 'Lefebvre',
    maidenName: 'Martin',
    birthDate: '1960-10-12',
    birthPlace: 'Perpignan, France',
    spouseId: 'father-marc',
    childrenIds: ['spouse-sibling-003'],
    occupation: 'Décoratrice',
    generation: -1,
  },

  // Parents d'Alex (époux de Camille)
  {
    id: 'father-alex',
    firstName: 'Gérard',
    lastName: 'Roussel',
    birthDate: '1965-06-07',
    birthPlace: 'Cannes, France',
    spouseId: 'mother-alex',
    childrenIds: ['spouse-sibling-004'],
    occupation: 'Photographe',
    generation: -1,
  },
  {
    id: 'mother-alex',
    firstName: 'Nathalie',
    lastName: 'Roussel',
    maidenName: 'Durand',
    birthDate: '1968-04-22',
    birthPlace: 'Nice, France',
    spouseId: 'father-alex',
    childrenIds: ['spouse-sibling-004'],
    occupation: 'Journaliste',
    generation: -1,
  },

  // === PARENTS DE SARAH (ÉPOUSE ACTUELLE DE JEAN) ===
  
  // Parents de Sarah Lefebvre (épouse actuelle de Jean)
  {
    id: 'father-sarah',
    firstName: 'François',
    lastName: 'Lefebvre',
    birthDate: '1963-11-15',
    birthPlace: 'Toulon, France',
    spouseId: 'mother-sarah',
    childrenIds: ['spouse-002'],
    occupation: 'Capitaine de Marine',
    generation: -1,
  },
  {
    id: 'mother-sarah',
    firstName: 'Brigitte',
    lastName: 'Lefebvre',
    maidenName: 'Moreau',
    birthDate: '1965-02-28',
    birthPlace: 'Aix-en-Provence, France',
    spouseId: 'father-sarah',
    childrenIds: ['spouse-002'],
    occupation: 'Professeure de Littérature',
    generation: -1,
  },

  // === PARENTS DE CÉLINE (EX-COMPAGNE DE PAUL) ===
  
  // Parents de Céline Morel (ex-compagne de Paul)
  {
    id: 'father-celine',
    firstName: 'Laurent',
    lastName: 'Morel',
    birthDate: '1958-07-12',
    birthPlace: 'Nancy, France',
    spouseId: 'mother-celine',
    childrenIds: ['ex-partner-paul'],
    occupation: 'Ingénieur Civil',
    generation: -1,
  },
  {
    id: 'mother-celine',
    firstName: 'Valérie',
    lastName: 'Morel',
    maidenName: 'Lemaire',
    birthDate: '1961-04-05',
    birthPlace: 'Metz, France',
    spouseId: 'father-celine',
    childrenIds: ['ex-partner-paul'],
    occupation: 'Infirmière Chef',
    generation: -1,
  },

  // === FAMILLES DES ENFANTS DE L'UTILISATEUR ===

  // Conjoint de Lucas (child-001 = fils de Jean avec ex-épouse)
  {
    id: 'spouse-child-001',
    firstName: 'Anna',
    lastName: 'Martin',
    maidenName: 'Silva',
    birthDate: '2010-03-15',
    birthPlace: 'Barcelona, Espagne',
    spouseId: 'child-001',
    parentIds: ['father-anna', 'mother-anna'],
    childrenIds: ['grandchild-001', 'grandchild-002'],
    occupation: 'Étudiante en Architecture',
    generation: 1,
  },

  // Enfant de Lucas
  {
    id: 'grandchild-002',
    firstName: 'Sofia',
    lastName: 'Martin',
    birthDate: '2024-08-20',
    birthPlace: 'Paris, France',
    parentIds: ['child-001', 'spouse-child-001'],
    generation: 2,
  },

  // Conjoint d'Emma (child-002 = fille de Jean avec ex-épouse)
  {
    id: 'spouse-child-002',
    firstName: 'Kevin',
    lastName: 'Dubois',
    birthDate: '2009-11-08',
    birthPlace: 'Montreal, Canada',
    spouseId: 'child-002',
    parentIds: ['father-kevin', 'mother-kevin'],
    childrenIds: ['grandchild-003'],
    occupation: 'Étudiant en Informatique',
    generation: 1,
  },

  // Enfant d'Emma
  {
    id: 'grandchild-003',
    firstName: 'Noah',
    lastName: 'Dubois',
    birthDate: '2025-05-12',
    birthPlace: 'Paris, France',
    parentIds: ['child-002', 'spouse-child-002'],
    generation: 2,
  },


  // === PARENTS DES CONJOINTS DES ENFANTS DE JEAN ===

  // Parents d'Anna Silva (épouse de Lucas)
  {
    id: 'father-anna',
    firstName: 'Carlos',
    lastName: 'Silva',
    birthDate: '1988-03-20',
    birthPlace: 'Barcelona, Espagne',
    spouseId: 'mother-anna',
    childrenIds: ['spouse-child-001'],
    occupation: 'Chef Cuisinier',
    generation: -1,
  },
  {
    id: 'mother-anna',
    firstName: 'Carmen',
    lastName: 'Silva',
    maidenName: 'Rodriguez',
    birthDate: '1990-07-08',
    birthPlace: 'Sevilla, Espagne',
    spouseId: 'father-anna',
    childrenIds: ['spouse-child-001'],
    occupation: 'Traductrice',
    generation: -1,
  },

  // Parents de Kevin Dubois (époux d'Emma)  
  {
    id: 'father-kevin',
    firstName: 'Robert',
    lastName: 'Dubois',
    birthDate: '1985-11-12',
    birthPlace: 'Montreal, Canada',
    spouseId: 'mother-kevin',
    childrenIds: ['spouse-child-002'],
    occupation: 'Développeur Logiciel',
    generation: -1,
  },
  {
    id: 'mother-kevin',
    firstName: 'Sophie',
    lastName: 'Dubois',
    maidenName: 'Tremblay',
    birthDate: '1987-09-25',
    birthPlace: 'Quebec, Canada',
    spouseId: 'father-kevin',
    childrenIds: ['spouse-child-002'],
    occupation: 'Designer Graphique',
    generation: -1,
  },

  // === PETITS-ENFANTS DES FRÈRES ET SŒURS ===

  // Petits-enfants de Paul (via Thomas - nephew-001)
  // Thomas Martin (2015) aura des enfants dans le futur
  {
    id: 'great-nephew-001',
    firstName: 'Antoine',
    lastName: 'Martin',
    birthDate: '2024-03-12',
    birthPlace: 'Lyon, France',
    parentIds: ['nephew-001', 'spouse-thomas'],
    generation: 2,
  },

  // Conjoint hypothétique de Thomas (pour cohérence)
  {
    id: 'spouse-thomas',
    firstName: 'Amélie',
    lastName: 'Martin',
    maidenName: 'Rousseau',
    birthDate: '2016-08-15',
    birthPlace: 'Grenoble, France',
    spouseId: 'nephew-001',
    childrenIds: ['great-nephew-001'],
    occupation: 'Étudiante',
    generation: 1,
  },

  // Petit-enfant de Paul (via Sophie - niece-001)
  // Sophie Martin (2018) aura un enfant dans le futur
  {
    id: 'great-niece-001',
    firstName: 'Zoé',
    lastName: 'Moreau',
    birthDate: '2025-11-08',
    birthPlace: 'Lyon, France',
    parentIds: ['niece-001', 'spouse-sophie'],
    generation: 2,
  },

  // Conjoint hypothétique de Sophie
  {
    id: 'spouse-sophie',
    firstName: 'Louis',
    lastName: 'Moreau',
    birthDate: '2017-05-20',
    birthPlace: 'Annecy, France',
    spouseId: 'niece-001',
    childrenIds: ['great-niece-001'],
    occupation: 'Lycéen',
    generation: 1,
  },

  // Petits-enfants de Marie-Claire (via Lucas et Emma Dubois)
  // Lucas Dubois (2012) aura un enfant
  {
    id: 'great-nephew-002',
    firstName: 'Gabriel',
    lastName: 'Dubois',
    birthDate: '2024-07-22',
    birthPlace: 'Marseille, France',
    parentIds: ['nephew-002', 'spouse-lucas-dubois'],
    generation: 2,
  },

  // Conjoint de Lucas Dubois
  {
    id: 'spouse-lucas-dubois',
    firstName: 'Clara',
    lastName: 'Dubois',
    maidenName: 'Bernard',
    birthDate: '2013-01-18',
    birthPlace: 'Aix-en-Provence, France',
    spouseId: 'nephew-002',
    childrenIds: ['great-nephew-002'],
    occupation: 'Étudiante',
    generation: 1,
  },

  // Emma Dubois (2014) aura un enfant
  {
    id: 'great-niece-002',
    firstName: 'Manon',
    lastName: 'Lambert',
    birthDate: '2025-02-14',
    birthPlace: 'Marseille, France',
    parentIds: ['niece-002', 'spouse-emma-dubois'],
    generation: 2,
  },

  // Conjoint d'Emma Dubois
  {
    id: 'spouse-emma-dubois',
    firstName: 'Théo',
    lastName: 'Lambert',
    birthDate: '2012-09-03',
    birthPlace: 'Toulon, France',
    spouseId: 'niece-002',
    childrenIds: ['great-niece-002'],
    occupation: 'Étudiant',
    generation: 1,
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