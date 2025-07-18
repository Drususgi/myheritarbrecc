'use client';

import React from 'react';
import { Card, Image, Text, Badge, Flex, View } from '@aws-amplify/ui-react';
import { Person, PersonCardProps } from '@/types/family';
import { Calendar, MapPin, Briefcase } from 'lucide-react';

const PersonCard: React.FC<PersonCardProps> = ({
  person,
  size = 'medium',
  onClick,
  isSelected = false,
  isHighlighted = false,
}) => {
  const cardSizes = {
    small: { width: '120px', height: '160px' },
    medium: { width: '180px', height: '220px' },
    large: { width: '240px', height: '280px' },
  };

  const avatarSizes = {
    small: '60px',
    medium: '80px',
    large: '100px',
  };

  const handleClick = () => {
    if (onClick) {
      onClick(person);
    }
  };

  const getAge = (birthDate?: string, deathDate?: string): string => {
    if (!birthDate) return '';
    
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    const age = Math.floor((end.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    
    return deathDate ? `${age} ans` : `${age} ans`;
  };

  const getDisplayName = (): string => {
    const firstName = person.firstName;
    const lastName = person.lastName;
    return `${firstName} ${lastName}`;
  };

  const getMaidenName = (): string => {
    return person.maidenName ? `(née ${person.maidenName})` : '';
  };

  return (
    <Card
      variation="elevated"
      padding="small"
      style={{
        ...cardSizes[size],
        cursor: onClick ? 'pointer' : 'default',
        border: isSelected ? '2px solid #007EB9' : isHighlighted ? '2px solid #FF9900' : '1px solid #e1e8ed',
        backgroundColor: person.isCurrentUser ? '#f0f8ff' : 'white',
        boxShadow: isSelected ? '0 4px 12px rgba(0, 126, 185, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
      onClick={handleClick}
      className="hover:shadow-lg transition-all duration-200"
    >
      {/* Badge utilisateur actuel */}
      {person.isCurrentUser && (
        <Badge
          variation="success"
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            fontSize: '10px',
            padding: '2px 6px',
          }}
        >
          Moi
        </Badge>
      )}

      {/* Photo de profil */}
      <Flex direction="column" alignItems="center" gap="small">
        <View
          style={{
            width: avatarSizes[size],
            height: avatarSizes[size],
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #e1e8ed',
          }}
        >
          {person.avatar ? (
            <Image
              src={person.avatar}
              alt={`Photo de ${person.firstName} ${person.lastName}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div 
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#e1e8ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#666',
              }}
            >
              {person.firstName[0]}{person.lastName[0]}
            </div>
          )}
        </View>

        {/* Nom */}
        <View textAlign="center">
          <Text
            fontSize={size === 'small' ? 'small' : 'medium'}
            fontWeight="bold"
            color={person.deathDate ? '#666' : '#333'}
            style={{
              textDecoration: person.deathDate ? 'line-through' : 'none',
            }}
          >
            {getDisplayName()}
          </Text>
          {person.maidenName && (
            <Text
              fontSize="small"
              color="#666"
              style={{ fontStyle: 'italic' }}
            >
              {getMaidenName()}
            </Text>
          )}
        </View>

        {/* Informations condensées */}
        <Flex direction="column" gap="xxs" style={{ width: '100%' }}>
          {/* Dates */}
          {person.birthDate && (
            <Flex alignItems="center" gap="xxs">
              <Calendar size={12} color="#666" />
              <Text fontSize="small" color="#666">
                {new Date(person.birthDate).getFullYear()}
                {person.deathDate && ` - ${new Date(person.deathDate).getFullYear()}`}
              </Text>
            </Flex>
          )}

          {/* Âge */}
          {person.birthDate && (
            <Text fontSize="small" color="#666" textAlign="center">
              {getAge(person.birthDate, person.deathDate)}
            </Text>
          )}

          {/* Lieu de naissance */}
          {person.birthPlace && size !== 'small' && (
            <Flex alignItems="center" gap="xxs">
              <MapPin size={12} color="#666" />
              <Text fontSize="small" color="#666" style={{ 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' 
              }}>
                {person.birthPlace}
              </Text>
            </Flex>
          )}

          {/* Profession */}
          {person.occupation && size === 'large' && (
            <Flex alignItems="center" gap="xxs">
              <Briefcase size={12} color="#666" />
              <Text fontSize="small" color="#666" style={{ 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' 
              }}>
                {person.occupation}
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};

export default PersonCard;