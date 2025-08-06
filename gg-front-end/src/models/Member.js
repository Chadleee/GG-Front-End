import memberAPI from '../api/members';

export class Member {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.displayName = data.displayName || data.name;
    this.bio = data.bio || '';
    this.image = data.image || '';
    this.joinDate = data.joinDate || '';
    this.socials = data.socials || [];
    this.gallery = data.gallery || [];
    this.clips = data.clips || [];
    this.createdAt = data.createdAt || '';
    this.updatedAt = data.updatedAt || '';
  }

  // Gallery methods
  async updateGallery(newGallery) {
    try {
      const updatedMember = { ...this, gallery: newGallery };
      const result = await memberAPI.update(this.id, updatedMember);
      
      // Update local instance
      this.gallery = newGallery;
      
      return result;
    } catch (error) {
      console.error('Failed to update member gallery:', error);
      throw error;
    }
  }

  async updateImageInGallery(imageIndex, imageData) {
    try {
      const updatedGallery = [...this.gallery];
      updatedGallery[imageIndex] = imageData;
      return await this.updateGallery(updatedGallery);
    } catch (error) {
      console.error('Failed to update image in member gallery:', error);
      throw error;
    }
  }



  // Clips methods
  async updateClips(newClips) {
    try {
      const updatedMember = { ...this, clips: newClips };
      const result = await memberAPI.update(this.id, updatedMember);
      
      // Update local instance
      this.clips = newClips;
      
      return result;
    } catch (error) {
      console.error('Failed to update member clips:', error);
      throw error;
    }
  }



  async updateClipInClips(clipIndex, clipData) {
    try {
      const updatedClips = [...this.clips];
      updatedClips[clipIndex] = clipData;
      return await this.updateClips(updatedClips);
    } catch (error) {
      console.error('Failed to update clip in member clips:', error);
      throw error;
    }
  }



  // Join date methods
  async updateJoinDate(newJoinDate) {
    try {
      const updatedMember = { ...this, joinDate: newJoinDate };
      const result = await memberAPI.update(this.id, updatedMember);
      
      // Update local instance
      this.joinDate = newJoinDate;
      
      return result;
    } catch (error) {
      console.error('Failed to update member join date:', error);
      throw error;
    }
  }

  // Bio methods
  async updateBio(newBio) {
    try {
      const updatedMember = { ...this, bio: newBio };
      const result = await memberAPI.update(this.id, updatedMember);
      
      // Update local instance
      this.bio = newBio;
      
      return result;
    } catch (error) {
      console.error('Failed to update member bio:', error);
      throw error;
    }
  }

  // Socials methods
  async updateSocials(newSocials) {
    try {
      const updatedMember = { ...this, socials: newSocials };
      const result = await memberAPI.update(this.id, updatedMember);
      
      // Update local instance
      this.socials = newSocials;
      
      return result;
    } catch (error) {
      console.error('Failed to update member socials:', error);
      throw error;
    }
  }



  async updateSocialInSocials(socialIndex, socialData) {
    try {
      const updatedSocials = [...this.socials];
      updatedSocials[socialIndex] = socialData;
      return await this.updateSocials(updatedSocials);
    } catch (error) {
      console.error('Failed to update social in member socials:', error);
      throw error;
    }
  }



  // General update method
  async update(updateData) {
    try {
      const updatedMember = { ...this, ...updateData };
      const result = await memberAPI.update(this.id, updatedMember);
      
      // Update local instance with new data
      Object.assign(this, result);
      
      return result;
    } catch (error) {
      console.error('Failed to update member:', error);
      throw error;
    }
  }

  // Delete method
  async delete() {
    try {
      await memberAPI.delete(this.id);
      return true;
    } catch (error) {
      console.error('Failed to delete member:', error);
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

  getSocialsCount() {
    return this.socials.length;
  }

  hasGallery() {
    return this.gallery.length > 0;
  }

  hasClips() {
    return this.clips.length > 0;
  }

  hasSocials() {
    return this.socials.length > 0;
  }

  hasJoinDate() {
    return this.joinDate && this.joinDate.trim() !== '';
  }

  getDisplayName() {
    return this.displayName || this.name;
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      displayName: this.displayName,
      bio: this.bio,
      image: this.image,
      joinDate: this.joinDate,
      socials: this.socials,
      gallery: this.gallery,
      clips: this.clips,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Static factory method
  static fromData(data) {
    return new Member(data);
  }
}

export default Member; 