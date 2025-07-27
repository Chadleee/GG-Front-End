import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  TextField, 
  InputAdornment,
  useTheme,
  Divider,
  Chip
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCharacters } from '../contexts/CharacterContext';
import { useMembers } from '../contexts/MemberContext';
import CharacterCard from './characters/CharacterCard';
import MemberCard from './members/MemberCard';

function SearchResults() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { characters } = useCharacters();
  const { members } = useMembers();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState({
    characters: [],
    members: [],
    videos: [],
    images: []
  });

  const query = searchParams.get('q') || '';

  useEffect(() => {
    setSearchTerm(query);
    if (query.trim() && characters.length > 0 && members.length > 0) {
      performSearch(query.trim());
    }
  }, [query, characters, members]);

  const performSearch = (term) => {
    console.log('Performing search for:', term);
    console.log('Characters loaded:', characters.length);
    console.log('Members loaded:', members.length);
    const lowerTerm = term.toLowerCase();
    
    // Check if the term is an exact name match
    const isExactName = (name) => name && name.toLowerCase() === lowerTerm;
    
    // Search characters
    let characterResults = characters.filter(character => {
      const characterName = character.name?.toLowerCase() || '';
      const characterDisplayName = character.displayName?.toLowerCase() || '';
      const memberName = members.find(member => member.id == character.memberId)?.name?.toLowerCase() || '';
      
      // If it's an exact name match, only return if it matches the character name
      if (isExactName(character.name)) {
        return true;
      }
      
      // If it's an exact member name match, only return if it matches the member
      if (isExactName(character.member)) {
        return true;
      }

      if (isExactName(characterDisplayName)) {
        return true;
      }
      
      // If not an exact name match, search in all fields
      return characterName.includes(lowerTerm) || 
             memberName.includes(lowerTerm) ||
             character.description?.toLowerCase().includes(lowerTerm) ||
             character.backstory?.toLowerCase().includes(lowerTerm) ||
             character.quotes?.some(quote => quote?.toLowerCase().includes(lowerTerm)) ||
             character.affiliations?.some(aff => aff?.toLowerCase().includes(lowerTerm)) ||
             character.avatarName?.toLowerCase().includes(lowerTerm) ||
             character.avatarDescription?.toLowerCase().includes(lowerTerm);
    });

    // If we found an exact member match, also include all characters played by that member
    const exactMemberMatch = members.find(member => isExactName(member.displayName || member.name));
    if (exactMemberMatch) {
      const memberName = (exactMemberMatch.displayName || exactMemberMatch.name)?.toLowerCase() || '';
      const additionalCharacters = characters.filter(character => 
        character.member?.toLowerCase() === memberName
      );
      // Add characters that aren't already in the results
      additionalCharacters.forEach(character => {
        if (!characterResults.find(c => c.id == character.id)) {
          characterResults.push(character);
        }
      });
    }

    // Search members
    let memberResults = members.filter(member => {
      const memberName = (member.displayName || member.name)?.toLowerCase() || '';
      const charactersPlayed = characters.filter(character => character.memberId == member.id);
      const memberBio = member.bio?.toLowerCase() || '';
      
      // If it's an exact name match, only return if it matches the member name
      if (isExactName(member.displayName || member.name)) {
        return true;
      }

      if (charactersPlayed.length > 0) {
        const filteredCharacters = charactersPlayed.filter(character => character.name?.toLowerCase().includes(lowerTerm) || character.displayName?.toLowerCase().includes(lowerTerm));
        if (filteredCharacters.length > 0) {
          return true;
        }
      }
      
      // If not an exact name match, search in all fields
      return memberName.includes(lowerTerm) || 
             memberBio.includes(lowerTerm) ||
             member.socialLinks?.some(link => link?.toLowerCase().includes(lowerTerm));
    });

    // If we found an exact character match, also include the member who plays that character
    const exactCharacterMatch = characters.find(character => isExactName(character.name));
    if (exactCharacterMatch) {
      const characterMemberName = exactCharacterMatch.member?.toLowerCase() || '';
      const characterMember = members.find(member => 
        (member.displayName || member.name)?.toLowerCase() === characterMemberName
      );
      if (characterMember) {
        // Add the member to member results if not already there
        if (!memberResults.find(m => m.id == characterMember.id)) {
          memberResults.push(characterMember);
        }
      }
    }

        // Search videos
    const videoResults = [];
    characters.forEach(character => {
      if (character.clips) {
        character.clips.forEach(clip => {
          const characterName = character.name?.toLowerCase() || '';
          const memberName = character.member?.toLowerCase() || '';
          
          // If it's an exact name match, include ALL videos for that character/member
          if (isExactName(character.name) || isExactName(character.member)) {
            videoResults.push({
              ...clip,
              characterName: character.name,
              characterId: character.id,
              memberName: character.member
            });
          } else {
            // If not an exact name match, search in title and character/member fields
            // But exclude if we're searching for a member and this is a character's video
            const isMemberSearch = exactMemberMatch && !isExactName(character.name);
            if (!isMemberSearch && (clip.title?.toLowerCase().includes(lowerTerm) ||
                characterName.includes(lowerTerm) ||
                memberName.includes(lowerTerm))) {
              videoResults.push({
                ...clip,
                characterName: character.name,
                characterId: character.id,
                memberName: character.member
              });
            }
          }
        });
      }
    });

        // Search images
    const imageResults = [];
    characters.forEach(character => {
      if (character.gallery) {
        character.gallery.forEach(image => {
          const characterName = character.name?.toLowerCase() || '';
          const memberName = character.member?.toLowerCase() || '';
          
          // If it's an exact name match, include ALL images for that character/member
          if (isExactName(character.name) || isExactName(character.member)) {
            imageResults.push({
              ...image,
              characterName: character.name,
              characterId: character.id,
              memberName: character.member
            });
          } else {
            // If not an exact name match, search in description and character/member fields
            // But exclude if we're searching for a member and this is a character's image
            const isMemberSearch = exactMemberMatch && !isExactName(character.name);
            if (!isMemberSearch && (image.description?.toLowerCase().includes(lowerTerm) ||
                characterName.includes(lowerTerm) ||
                memberName.includes(lowerTerm))) {
              imageResults.push({
                ...image,
                characterName: character.name,
                characterId: character.id,
                memberName: character.member
              });
            }
          }
        });
      }
    });

    // Also search member videos and images
    members.forEach(member => {
      if (member.clips) {
        member.clips.forEach(clip => {
          const memberName = (member.displayName || member.name)?.toLowerCase() || '';
          
                    // If it's an exact name match, include ALL videos for that member
          if (isExactName(member.displayName || member.name)) {
            videoResults.push({
              ...clip,
              memberName: member.displayName || member.name,
              memberId: member.id
            });
          } else {
              // If not an exact name match, search in title and member fields
              if (clip.title?.toLowerCase().includes(lowerTerm) ||
                  memberName.includes(lowerTerm)) {
              videoResults.push({
                ...clip,
                memberName: member.displayName || member.name,
                memberId: member.id
              });
            }
          }
        });
      }
      
      if (member.gallery) {
        member.gallery.forEach(image => {
          const memberName = (member.displayName || member.name)?.toLowerCase() || '';
          
                    // If it's an exact name match, include ALL images for that member
          if (isExactName(member.displayName || member.name)) {
            imageResults.push({
              ...image,
              memberName: member.displayName || member.name,
              memberId: member.id
            });
          } else {
              // If not an exact name match, search in description and member fields
              if (image.description?.toLowerCase().includes(lowerTerm) ||
                  memberName.includes(lowerTerm)) {
              imageResults.push({
                ...image,
                memberName: member.displayName || member.name,
                memberId: member.id
              });
            }
          }
        });
      }
    });

    setResults({
      characters: characterResults,
      members: memberResults,
      videos: videoResults,
      images: imageResults
    });
    
    console.log('Search results:', {
      characters: characterResults.length,
      members: memberResults.length,
      videos: videoResults.length,
      images: imageResults.length
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const totalResults = results.characters.length + results.members.length + results.videos.length + results.images.length;

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Search Results
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search characters, members, videos, and images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme.palette.background.paper,
              '& fieldset': {
                borderColor: theme.palette.mode === 'light' ? '#e0e0e0' : '#333333',
              },
            },
          }}
        />
      </Box>

      {/* Results Count */}
      <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.secondary }}>
        {totalResults} result{totalResults !== 1 ? 's' : ''} found for "{query}"
      </Typography>

      {/* Members Section */}
      {results.members.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Members ({results.members.length})
          </Typography>
          <Grid container spacing={3}>
            {results.members.map((member) => (
              <Grid key={member.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <MemberCard member={member} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Characters Section */}
      {results.characters.length > 0 && (
        <Box sx={{ mb: 4 }}>
          {results.members.length > 0 && <Divider sx={{ my: 3 }} />}
          <Typography variant="h5" sx={{ mb: 2 }}>
            Characters ({results.characters.length})
          </Typography>
          <Grid container spacing={3}>
            {results.characters.map((character) => (
              <Grid key={character.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <CharacterCard character={character} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Videos Section */}
      {results.videos.length > 0 && (
        <Box sx={{ mb: 4 }}>
          {(results.members.length > 0 || results.characters.length > 0) && <Divider sx={{ my: 3 }} />}
          <Typography variant="h5" sx={{ mb: 2 }}>
            Videos ({results.videos.length})
          </Typography>
          <Grid container spacing={3}>
            {results.videos.map((video, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.mode === 'light' ? '#e0e0e0' : '#333333'}`
                  }}
                  onClick={() => {
                    if (video.url) {
                      window.open(video.url, '_blank');
                    }
                  }}
                >
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1,
                        color: theme.palette.text.primary,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.2
                      }}
                    >
                      {video.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        color: theme.palette.text.secondary,
                        cursor: 'pointer',
                        '&:hover': {
                          color: theme.palette.primary.main,
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (video.characterId) {
                          navigate(`/characters/${video.characterId}`);
                        } else if (video.memberId) {
                          navigate(`/members/${video.memberId}`);
                        }
                      }}
                    >
                      {video.characterName || video.memberName}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Chip 
                        label={video.platform || 'Video'} 
                        size="small"
                        sx={{ 
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Images Section */}
      {results.images.length > 0 && (
        <Box sx={{ mb: 4 }}>
          {(results.characters.length > 0 || results.members.length > 0 || results.videos.length > 0) && <Divider sx={{ my: 3 }} />}
          <Typography variant="h5" sx={{ mb: 2 }}>
            Images ({results.images.length})
          </Typography>
          <Grid container spacing={3}>
            {results.images.map((image, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card 
                  sx={{ 
                    height: '300px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.mode === 'light' ? '#e0e0e0' : '#333333'}`
                  }}
                  onClick={() => {
                    window.open(image.url, '_blank');
                  }}
                >
                  <Box sx={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '100%',
                    overflow: 'hidden'
                  }}>
                    <Box
                      component="img"
                      src={image.url}
                      alt={image.description}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        }
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      color: 'white',
                      p: 2
                    }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {image.description}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': {
                            color: theme.palette.primary.light,
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (image.characterId) {
                            navigate(`/characters/${image.characterId}`);
                          } else if (image.memberId) {
                            navigate(`/members/${image.memberId}`);
                          }
                        }}
                      >
                        {image.characterName || image.memberName}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* No Results */}
      {totalResults === 0 && query && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.secondary }}>
            No results found for "{query}"
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Try searching for different terms or check your spelling.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default SearchResults; 