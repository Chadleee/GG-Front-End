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
    this.createdAt = data.createdAt || '';
    this.updatedAt = data.updatedAt || '';
  }

  // Gallery methods
  async updateGallery(newGallery) {
    try {
      const updatedCharacter = { ...this, gallery: newGallery };
      const result = await characterAPI.update(this.id, updatedCharacter);
      
      // Update local instance
      this.gallery = newGallery;
      
      return result;
    } catch (error) {
      console.error('Failed to update character gallery:', error);
      throw error;
    }
  }



  async updateImageInGallery(imageIndex, imageData) {
    try {
      const updatedGallery = [...this.gallery];
      updatedGallery[imageIndex] = imageData;
      return await this.updateGallery(updatedGallery);
    } catch (error) {
      console.error('Failed to update image in character gallery:', error);
      throw error;
    }
  }

  async deleteImageFromGallery(imageIndex) {
    try {
      const updatedGallery = this.gallery.filter((_, index) => index !== imageIndex);
      return await this.updateGallery(updatedGallery);
    } catch (error) {
      console.error('Failed to delete image from character gallery:', error);
      throw error;
    }
  }

  // Clips methods
  async updateClips(newClips) {
    try {
      const updatedCharacter = { ...this, clips: newClips };
      const result = await characterAPI.update(this.id, updatedCharacter);
      
      // Update local instance
      this.clips = newClips;
      
      return result;
    } catch (error) {
      console.error('Failed to update character clips:', error);
      throw error;
    }
  }



  async updateClipInClips(clipIndex, clipData) {
    try {
      const updatedClips = [...this.clips];
      updatedClips[clipIndex] = clipData;
      return await this.updateClips(updatedClips);
    } catch (error) {
      console.error('Failed to update clip in character clips:', error);
      throw error;
    }
  }

  async deleteClipFromClips(clipIndex) {
    try {
      const updatedClips = this.clips.filter((_, index) => index !== clipIndex);
      return await this.updateClips(updatedClips);
    } catch (error) {
      console.error('Failed to delete clip from character clips:', error);
      throw error;
    }
  }

  // Socials methods
  async updateSocials(newSocials) {
    try {
      const updatedCharacter = { ...this, socials: newSocials };
      const result = await characterAPI.update(this.id, updatedCharacter);
      
      // Update local instance
      this.socials = newSocials;
      
      return result;
    } catch (error) {
      console.error('Failed to update character socials:', error);
      throw error;
    }
  }



  async updateSocialInSocials(socialIndex, socialData) {
    try {
      const updatedSocials = [...this.socials];
      updatedSocials[socialIndex] = socialData;
      return await this.updateSocials(updatedSocials);
    } catch (error) {
      console.error('Failed to update social in character socials:', error);
      throw error;
    }
  }

  async deleteSocialFromSocials(socialIndex) {
    try {
      const updatedSocials = this.socials.filter((_, index) => index !== socialIndex);
      return await this.updateSocials(updatedSocials);
    } catch (error) {
      console.error('Failed to delete social from character socials:', error);
      throw error;
    }
  }

  // General update method
  async update(updateData) {
    try {
      const updatedCharacter = { ...this, ...updateData };
      const result = await characterAPI.update(this.id, updatedCharacter);
      
      // Update local instance with new data
      Object.assign(this, result);
      
      return result;
    } catch (error) {
      console.error('Failed to update character:', error);
      throw error;
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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Static factory method
  static fromData(data) {
    return new Character(data);
  }
}

export default Character; 