import characterAPI from '../api/characters';

export class Character {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description || '';
    this.backstory = data.backstory || '';
    this.quotes = data.quotes || [];
    this.relationships = data.relationships || [];
    this.affiliations = data.affiliations || [];
    this.memberId = data.memberId;
    this.image = data.image || '';
    this.gallery = data.gallery || [];
    this.clips = data.clips || [];
    this.socials = data.socials || [];
    // Additional properties from database
    this.characterType = data.characterType || '';
    this.seasons = data.seasons || [];
    this.avatarInfo = data.avatarInfo || {};
    this.avatarName = data.avatarName || '';
    this.avatarDescription = data.avatarDescription || '';
    this.avatarUrl = data.avatarUrl || '';
    this.avatarReferenceImage = data.avatarReferenceImage || '';
    this.createdAt = data.createdAt || '';
    this.updatedAt = data.updatedAt || '';
  }

  // Dynamic update method
  async update(newValue, fieldName) {
    await this.createChangeRequests(newValue, fieldName);
    try {
      // Handle special cases for avatar info
      if (fieldName === 'avatarInfo' && typeof newValue === 'object') {
        const updatedCharacter = { 
          ...this, 
          avatarName: newValue.avatarName || this.avatarName,
          avatarDescription: newValue.avatarDescription || this.avatarDescription,
          avatarUrl: newValue.avatarUrl || this.avatarUrl,
          avatarReferenceImage: newValue.avatarReferenceImage || this.avatarReferenceImage
        };

        // Update local instance
        this.avatarName = updatedCharacter.avatarName;
        this.avatarDescription = updatedCharacter.avatarDescription;
        this.avatarUrl = updatedCharacter.avatarUrl;
        this.avatarReferenceImage = updatedCharacter.avatarReferenceImage;
        return updatedCharacter;
      }

      // Handle simple field updates
      const updatedCharacter = { ...this, [fieldName]: newValue };

      // Update local instance
      this[fieldName] = newValue;

      return updatedCharacter;
    } catch (error) {
      console.error(`Failed to update character ${fieldName}:`, error);
      throw error;
    }
  }

  async createChangeRequests(newValue, fieldName) {
    const changeRequests = [];
    if (fieldName === 'avatarInfo' && typeof newValue === 'object') {
      changeRequests.push({
        id: this.id,
        entity: 'character',
        entityId: this.id,
        fieldType: 'avatarName',
        oldValue: this.avatarName,
        newValue: newValue.avatarName
      });
      changeRequests.push({
        id: this.id,
        entity: 'character',
        entityId: this.id,
        fieldType: 'avatarDescription',
        oldValue: this.avatarDescription,
        newValue: newValue.avatarDescription
      });
      changeRequests.push({
        id: this.id,
        entity: 'character',
        entityId: this.id,
        fieldType: 'avatarUrl',
        oldValue: this.avatarUrl,
        newValue: newValue.avatarUrl
      });
      changeRequests.push({
        id: this.id,
        entity: 'character',
        entityId: this.id,
        fieldType: 'avatarReferenceImage',
        oldValue: this.avatarReferenceImage,
        newValue: newValue.avatarReferenceImage
      });

      await this.sendUpdateRequests(changeRequests);
      return true;
    }

    changeRequests.push({
      id: this.id,
      entity: 'character',
      entityId: this.id,
      fieldType: fieldName,
      oldValue: this[fieldName],
      newValue: newValue
    });

    await this.sendUpdateRequests(changeRequests);
    return true;
  }

  // take in update requests and send to api
  async sendUpdateRequests(updateRequests) {
    for (const request of updateRequests) {
      await characterAPI.update(this.id, request);
    }
  }

  // Delete method
  async delete() {
    try {
      await characterAPI.delete(this.id);
      return true;
    } catch (error) {
      console.error('Failed to delete character:', error);
      throw error;
    }
  }

  // Utility methods
  getGalleryCount() {
    return this.gallery.length;
  }

  getClipsCount() {
    return this.clips.length;
  }

  hasGallery() {
    return this.gallery.length > 0;
  }

  hasClips() {
    return this.clips.length > 0;
  }

  getSocialsCount() {
    return this.socials.length;
  }

  hasSocials() {
    return this.socials.length > 0;
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      backstory: this.backstory,
      quotes: this.quotes,
      relationships: this.relationships,
      affiliations: this.affiliations,
      memberId: this.memberId,
      image: this.image,
      gallery: this.gallery,
      clips: this.clips,
      socials: this.socials,
      characterType: this.characterType,
      seasons: this.seasons,
      avatarInfo: this.avatarInfo,
      avatarName: this.avatarName,
      avatarDescription: this.avatarDescription,
      avatarUrl: this.avatarUrl,
      avatarReferenceImage: this.avatarReferenceImage,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Static factory method
  static fromData(data) {
    return new Character(data);
  }

  // Static create method
  static async create(name, memberId) {
    try {
      const characterData = {
        name: name,
        memberId: memberId,
        description: '',
        backstory: '',
        quotes: [],
        relationships: [],
        affiliations: [],
        image: '',
        gallery: [],
        clips: [],
        socials: [],
        characterType: '',
        seasons: [],
        avatarInfo: {
          name: name,
          description: '',
          url: ''
        },
        avatarName: name,
        avatarDescription: '',
        avatarUrl: '',
        avatarReferenceImage: '',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      const result = await characterAPI.create(characterData);
      return new Character(result);
    } catch (error) {
      console.error('Failed to create character:', error);
      throw error;
    }
  }
}

export default Character; 