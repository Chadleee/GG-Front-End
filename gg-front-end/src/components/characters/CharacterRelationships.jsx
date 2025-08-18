import { Box, Typography, Avatar, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Edit as EditIcon } from '@mui/icons-material';
import ExpandableCard from '../shared/ExpandableCard';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useCharacters } from '../../contexts/CharacterContext';
import { useChangeRequests } from '../../contexts/ChangeRequestContext';
import { getPendingChanges, aggregateArrayChanges, getArrayChangeText } from '../../utils/changeDetection';
import { useState } from 'react';
import RelationshipsEditDialog from './RelationshipsEditDialog';
import shabammabop from '../../assets/shabammabop.png';
import crazyGirl from '../../assets/crazy_girl.png';
import joeBiden from '../../assets/joe_biden.png';
import jigsaw from '../../assets/jigsaw.png';
import roflgator from '../../assets/roflgator.png';
import steven from '../../assets/steven.png';
import gasStationEmployee from '../../assets/gas_station_employee.png';
import marcus from '../../assets/marcus.png';

function CharacterRelationships({ character, theme, canEdit, onCharacterUpdate }) {
  const navigate = useNavigate();
  const { characters, fetchCharacters, getCharacterById } = useCharacters();
  const { getChangeRequestsByCharacterId } = useChangeRequests();
  const [relationshipsEditDialogOpen, setRelationshipsEditDialogOpen] = useState(false);

  // Get pending changes for relationships
  const relationshipsPendingChanges = (() => {
    if (!character?.id) return [];
    const requests = getChangeRequestsByCharacterId(character.id);
    return getPendingChanges(requests, 'character', character.id, 'relationships');
  })();

  // Aggregate all pending changes for relationships
  const relationshipsArrayChanges = relationshipsPendingChanges.length > 0 ? aggregateArrayChanges(relationshipsPendingChanges) : null;
  const hasPendingChanges = relationshipsArrayChanges ? (relationshipsArrayChanges.added.length > 0 || relationshipsArrayChanges.removed.length > 0 || relationshipsArrayChanges.modified.length > 0) : false;

  // Function to determine if infinite scrolling should be enabled
  const shouldEnableInfinite = () => {
    const width = window.innerWidth;
    let slidesToShow = 5; // default
    
    if (width <= 480) {
      slidesToShow = 1;
    } else if (width <= 768) {
      slidesToShow = 2;
    } else if (width <= 1024) {
      slidesToShow = 3;
    } else if (width <= 1200) {
      slidesToShow = 4;
    }
    
    return character.relationships && character.relationships.length > slidesToShow;
  };

  const getCharacterImage = (characterName, imageUrl) => {
    switch (characterName) {
      case 'Shabammabop':
        return shabammabop;
      case 'Crazy Girl':
        return crazyGirl;
      case 'Joe Biden':
        return joeBiden;
      case 'Jigsaw':
        return jigsaw;
      case 'Roflgator':
        return roflgator;
      case 'Steven':
        return steven;
      case 'Gas Station Employee':
        return gasStationEmployee;
      case 'Marcus':
        return marcus;
      default:
        return imageUrl;
    }
  };

  // Get related characters data
  const getRelatedCharacters = () => {
    if (!character.relationships) return [];
    
    return character.relationships.map(relationship => {
      const relatedCharacter = characters.find(c => c.id == relationship.character_id);
      if (relatedCharacter) {
        return {
          ...relatedCharacter,
          relationshipType: relationship.relationship_type,
          relationshipDescription: relationship.description
        };
      }
      return null;
    }).filter(Boolean);
  };

  const relatedCharacters = getRelatedCharacters();

  return (
    <Box>
      <ExpandableCard 
        title="Character Relationships"
        defaultExpanded={true}
        headerActions={
          canEdit ? (
            <Button 
              startIcon={<EditIcon />}
              onClick={(e) => {
                e.stopPropagation(); // Prevent header click when clicking edit button
                setRelationshipsEditDialogOpen(true);
              }}
              sx={{ 
                mr: 0, 
                color: hasPendingChanges ? theme.palette.warning.main : (theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary),
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                }
              }}
            >
              Edit
            </Button>
          ) : null
        }
      >
        {relatedCharacters.length > 0 ? (
          <Box sx={{ px: 2, py: 1, '& .slick-dots li button:before': { color: '#FFFFFF !important' }, '& .slick-dots li.slick-active button:before': { color: '#FFFFFF !important' } }}>
            <Slider
              dots={shouldEnableInfinite()}
              infinite={shouldEnableInfinite()}
              speed={500}
              slidesToShow={5}
              slidesToScroll={5}
              responsive={[
                {
                  breakpoint: 1200,
                  settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                  }
                },
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                  }
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                  }
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                  }
                }
              ]}
            >
              {relatedCharacters.map((relatedCharacter) => (
                <Box 
                  key={relatedCharacter.id}
                  sx={{ 
                    width: '100%',
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.3s ease-in-out'
                    }
                  }}
                  onClick={() => navigate(`/characters/${relatedCharacter.id}`)}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Avatar 
                      src={getCharacterImage(relatedCharacter.name, relatedCharacter.image)} 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        mb: 1,
                        border: `3px solid ${theme.palette.primary.main}`,
                        boxShadow: theme.shadows[4]
                      }}
                    />
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
                        textAlign: 'center',
                        fontWeight: 'medium',
                        maxWidth: '100px',
                        minHeight: '2.5em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        hyphens: 'auto',
                        fontSize: 'clamp(0.8rem, 2vw, 1.2rem)',
                        lineHeight: 1.2,
                        mb: 1,
                        // Scale down single words to fit on one line
                        '&:not(:has(span))': {
                          fontSize: 'clamp(0.6rem, 1.5vw, 1rem)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }
                      }}
                    >
                      {(relatedCharacter.displayName || relatedCharacter.name).includes(' ') ? (
                        // Multi-word names: allow wrapping
                        relatedCharacter.displayName || relatedCharacter.name
                      ) : (
                        // Single words: scale down to fit
                        <span style={{ 
                          fontSize: 'clamp(0.6rem, 1.5vw, 1rem)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block',
                          width: '100%'
                        }}>
                          {relatedCharacter.displayName || relatedCharacter.name}
                        </span>
                      )}
                    </Typography>
                    <Chip
                      label={relatedCharacter.relationshipType}
                      size="small"
                      sx={{
                        backgroundColor: '#d3d3d3',
                        color: '#000000',
                        fontSize: '0.75rem',
                        padding: '2px 8px'
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Slider>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ color: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.secondary }}>
            No relationships found.
          </Typography>
        )}
      </ExpandableCard>

      {/* Relationships Edit Dialog */}
      <RelationshipsEditDialog
        open={relationshipsEditDialogOpen}
        onClose={() => setRelationshipsEditDialogOpen(false)}
        relationships={character.relationships || []}
        character={character}
        onSave={async (updatedRelationships) => {
          try {
                  await character.update(updatedRelationships, 'relationships');
      await fetchCharacters();
      const updatedCharacter = getCharacterById(character.id);
      onCharacterUpdate(updatedCharacter);
            setRelationshipsEditDialogOpen(false);
          } catch (error) {
            console.error('Failed to update character relationships:', error);
          }
        }}
      />
    </Box>
  );
}

export default CharacterRelationships; 