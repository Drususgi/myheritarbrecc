'use client';

import React from 'react';
import { Person } from '@/types/family';

interface FamilyMember {
  person: Person;
  relationship: string;
  category: string;
  isFocalPerson: boolean;
  isCurrentUser: boolean;
}

interface FamilyListViewProps {
  people: Person[];
  focalPersonId: string;
  onPersonClick: (person: Person) => void;
  getRelationshipLabel: (personId: string, focalPersonId: string) => string;
  buildTreeFromPerspective: (focalPersonId: string) => any;
}

const FamilyListView: React.FC<FamilyListViewProps> = ({
  people,
  focalPersonId,
  onPersonClick,
  getRelationshipLabel,
  buildTreeFromPerspective
}) => {
  const focalPerson = people.find(p => p.id === focalPersonId);
  const currentUser = people.find(p => p.isCurrentUser);

  // État pour gérer l'expansion/réduction des catégories
  const [expandedCategories, setExpandedCategories] = React.useState<{[key: string]: boolean}>({
    grandparents: true,
    parents: true,
    siblings: true,
    siblings_spouses: true,
    spouses: true,
    children: true,
    inlaws: true,
    nephews_nieces: true,
    nephews_nieces_spouses: true,
    grandchildren_parents: true,
    grandchildren: true,
    grand_nephews_nieces: true,
    other: true
  });

  if (!focalPerson) return null;

  // Fonction pour toggle l'état d'une catégorie
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Construire la liste des membres familiaux avec leurs relations
  const buildFamilyMembersList = (): FamilyMember[] => {
    const familyGroups = buildTreeFromPerspective(focalPersonId);
    const allFamilyIds = new Set<string>();
    
    // Collecter tous les IDs des membres de famille
    Object.values(familyGroups).forEach((group: any) => {
      if (group.people) {
        group.people.forEach((id: string) => allFamilyIds.add(id));
      }
    });
    

    const familyMembers: FamilyMember[] = [];

    // Toujours ajouter l'utilisateur actuel en premier (sauf s'il est la personne focale)
    if (currentUser && currentUser.id !== focalPersonId) {
      familyMembers.push({
        person: currentUser,
        relationship: 'Moi',
        category: 'navigation',
        isFocalPerson: false,
        isCurrentUser: true
      });
    }

    // Ajouter la personne focale
    familyMembers.push({
      person: focalPerson,
      relationship: focalPersonId === currentUser?.id ? 'Moi' : focalPerson.firstName,
      category: 'focal',
      isFocalPerson: true,
      isCurrentUser: focalPersonId === currentUser?.id
    });

    // Ajouter tous les autres membres de famille
    allFamilyIds.forEach(personId => {
      if (personId !== focalPersonId && personId !== currentUser?.id) {
        const person = people.find(p => p.id === personId);
        if (person) {
          const relationship = getRelationshipLabel(personId, focalPersonId);
          let category = 'other';
          
          // Catégoriser selon la relation
          
          if (relationship.includes('Grand')) category = 'grandparents';
          else if (relationship.includes('Père') || relationship.includes('Mère')) category = 'parents';
          else if (relationship.includes('Frère') || relationship.includes('Sœur') || relationship.includes('sœur') || relationship.includes('Demi-frère') || relationship.includes('Demi-sœur')) {
            category = 'siblings';
          }
          else if (relationship.includes('Belle-sœur') || relationship.includes('Beau-frère')) category = 'siblings_spouses';
          else if (relationship.includes('Épou') || relationship.includes('Compag')) category = 'spouses';
          else if (relationship.includes('Fils') || relationship.includes('Fille')) category = 'children';
          else if (relationship.includes('Belle-fille') || relationship.includes('Gendre')) category = 'inlaws';
          else if (relationship.includes('Neveu') || relationship.includes('Nièce')) category = 'nephews_nieces';
          else if (relationship.includes('Conjoint de neveu') || relationship.includes('Conjoint de nièce')) category = 'nephews_nieces_spouses';
          else if (relationship.includes('Parent de petit-enfant')) category = 'grandchildren_parents';
          else if (relationship.includes('Petit-fils') || relationship.includes('Petite-fille') || relationship.includes('Petit-enfant')) category = 'grandchildren';
          else if (relationship.includes('Arrière-neveu') || relationship.includes('Arrière-nièce')) category = 'grand_nephews_nieces';

          
          familyMembers.push({
            person,
            relationship,
            category,
            isFocalPerson: false,
            isCurrentUser: false
          });
        }
      }
    });

    // Trier par catégorie puis alphabétiquement
    const categoryOrder = [
      'navigation', 'focal', 
      'grandparents', 'parents', 
      'siblings', 'siblings_spouses', 
      'spouses', 'children', 'inlaws', 
      'nephews_nieces', 'nephews_nieces_spouses',
      'grandchildren_parents', 'grandchildren', 
      'grand_nephews_nieces',
      'other'
    ];
    
    return familyMembers.sort((a, b) => {
      const catA = categoryOrder.indexOf(a.category);
      const catB = categoryOrder.indexOf(b.category);
      
      if (catA !== catB) {
        return catA - catB;
      }
      
      // Tri alphabétique dans la même catégorie
      return a.person.firstName.localeCompare(b.person.firstName);
    });
  };

  const familyMembersList = buildFamilyMembersList();

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'navigation': return '🏠';
      case 'focal': return '👤';
      case 'grandparents': return '👴';
      case 'parents': return '👨‍👩‍👧‍👦';
      case 'siblings': return '👫';
      case 'siblings_spouses': return '💏';
      case 'spouses': return '💑';
      case 'children': return '👶';
      case 'inlaws': return '💒';
      case 'nephews_nieces': return '👦👧';
      case 'nephews_nieces_spouses': return '👩‍❤️‍👨';
      case 'grandchildren_parents': return '👨‍👩‍👧';
      case 'grandchildren': return '🧒';
      case 'grand_nephews_nieces': return '👶👶';
      default: return '👤';
    }
  };

  const getCategoryHeader = (category: string): string | null => {
    switch (category) {
      case 'grandparents': return 'Mes Grands-parents';
      case 'parents': return 'Mes Parents';
      case 'siblings': return 'Mes Frères et Sœurs';
      case 'siblings_spouses': return 'Conjoints de mes Frères/Sœurs';
      case 'spouses': return 'Mes Conjoints';
      case 'children': return 'Mes Enfants';
      case 'inlaws': return 'Mes Beaux-enfants';
      case 'nephews_nieces': return 'Mes Neveux et Nièces';
      case 'nephews_nieces_spouses': return 'Conjoints de mes Neveux/Nièces';
      case 'grandchildren_parents': return 'Parents de mes Petits-enfants';
      case 'grandchildren': return 'Mes Petits-enfants';
      case 'grand_nephews_nieces': return 'Mes Arrière-neveux et Nièces';
      case 'other': return 'Autres';
      default: return null;
    }
  };

  // Grouper les membres par catégorie
  const membersByCategory = familyMembersList.reduce((acc, member) => {
    if (!acc[member.category]) {
      acc[member.category] = [];
    }
    acc[member.category].push(member);
    return acc;
  }, {} as {[key: string]: FamilyMember[]});

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '20px',
        backgroundColor: '#007EB9',
        color: 'white',
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        📋 Famille de {focalPerson.firstName} {focalPerson.lastName}
      </div>

      <div style={{
        padding: '20px',
        overflow: 'auto',
        height: 'calc(100vh - 80px)'
      }}>
        {/* Affichage des membres de navigation et focal en premier */}
        {membersByCategory.navigation?.map((familyMember, index) => (
          <div key={`nav-${familyMember.person.id}-${index}`}>
            {renderFamilyMemberRow(familyMember)}
          </div>
        ))}
        
        {membersByCategory.focal?.map((familyMember, index) => (
          <div key={`focal-${familyMember.person.id}-${index}`}>
            {renderFamilyMemberRow(familyMember)}
          </div>
        ))}

        {/* Séparateur */}
        <div style={{
          height: '2px',
          backgroundColor: '#ddd',
          margin: '20px 0',
          borderRadius: '1px'
        }} />

        {/* Affichage des autres catégories avec en-têtes cliquables */}
        {Object.entries(membersByCategory).map(([category, members]) => {
          if (category === 'navigation' || category === 'focal') return null;
          
          const categoryHeader = getCategoryHeader(category);
          if (!categoryHeader) return null;

          const isExpanded = expandedCategories[category];
          const memberCount = members.length;

          return (
            <div key={category} style={{ marginBottom: '15px' }}>
              {/* En-tête de catégorie cliquable */}
              <div 
                onClick={() => toggleCategory(category)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#333',
                  margin: '15px 0 10px 0',
                  padding: '8px 12px',
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                {/* Icône expand/collapse */}
                <span style={{ 
                  marginRight: '10px', 
                  fontSize: '14px',
                  color: '#007EB9',
                  transition: 'transform 0.2s ease',
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                }}>
                  ▶
                </span>
                
                {/* Titre et compteur */}
                <span style={{ flex: 1 }}>
                  {categoryHeader} ({memberCount})
                </span>
                
                {/* Icône de catégorie */}
                <span style={{ fontSize: '18px' }}>
                  {getCategoryIcon(category)}
                </span>
              </div>

              {/* Liste des membres (affichée seulement si expanded) */}
              <div style={{
                maxHeight: isExpanded ? '1000px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-in-out',
                paddingLeft: '20px'
              }}>
                {isExpanded && members.map((familyMember, index) => (
                  <div key={`${category}-${familyMember.person.id}-${index}`}>
                    {renderFamilyMemberRow(familyMember)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Fonction pour rendre une ligne de membre familial
  function renderFamilyMemberRow(familyMember: FamilyMember) {
    return (
      <div
        onClick={() => onPersonClick(familyMember.person)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: familyMember.isFocalPerson ? '#e3f2fd' : 
                          familyMember.isCurrentUser ? '#e8f5e8' : 'white',
          border: familyMember.isFocalPerson ? '2px solid #2196F3' : 
                 familyMember.isCurrentUser ? '2px solid #4CAF50' : '1px solid #e0e0e0',
          borderRadius: '8px',
          margin: '4px 0',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Icône */}
        <div style={{
          fontSize: '24px',
          marginRight: '15px',
          minWidth: '30px'
        }}>
          {getCategoryIcon(familyMember.category)}
        </div>

        {/* Informations personnelles */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: familyMember.isFocalPerson ? '#1976D2' : '#333'
          }}>
            {familyMember.person.firstName} {familyMember.person.lastName}
            {familyMember.person.maidenName && (
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 'normal', 
                color: '#666',
                fontStyle: 'italic'
              }}>
                {' '}(née {familyMember.person.maidenName})
              </span>
            )}
          </div>
          
          <div style={{
            fontSize: '14px',
            color: '#666',
            marginTop: '2px'
          }}>
            {familyMember.relationship}
          </div>

          {familyMember.person.birthDate && (
            <div style={{
              fontSize: '12px',
              color: '#999',
              marginTop: '2px'
            }}>
              Né(e) en {new Date(familyMember.person.birthDate).getFullYear()}
              {familyMember.person.deathDate && 
                ` - Décédé(e) en ${new Date(familyMember.person.deathDate).getFullYear()}`
              }
            </div>
          )}
        </div>

        {/* Badge spécial */}
        {(familyMember.isCurrentUser || familyMember.isFocalPerson) && (
          <div style={{
            backgroundColor: familyMember.isCurrentUser ? '#4CAF50' : '#2196F3',
            color: 'white',
            fontSize: '10px',
            padding: '4px 8px',
            borderRadius: '12px',
            fontWeight: 'bold'
          }}>
            {familyMember.isCurrentUser ? 'MOI' : 'FOCUS'}
          </div>
        )}
      </div>
    );
  }
};

export default FamilyListView;