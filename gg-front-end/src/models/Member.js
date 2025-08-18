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

  // Dynamic update method
  async update(newValue, fieldName) {
    await this.createChangeRequests(newValue, fieldName);
    try {
      // Handle simple field updates
      const updatedMember = { ...this, [fieldName]: newValue };

      // Update local instance
      this[fieldName] = newValue;

      return updatedMember;
    } catch (error) {
      console.error(`Failed to update member ${fieldName}:`, error);
      throw error;
    }
  }

  async createChangeRequests(newValue, fieldName) {
    const changeRequests = [];
    changeRequests.push({
      id: this.id,
      entity: 'member',
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
    const result = await memberAPI.update(this.id, updateRequests);
    return result;
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

  // Static create method
  static async create(name) {
    try {
      const memberData = {
        name: name,
        displayName: name, // Copy name to displayName
        bio: '',
        image: '',
        joinDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        socials: [],
        gallery: [],
        clips: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      const result = await memberAPI.create(memberData);
      return new Member(result);
    } catch (error) {
      console.error('Failed to create member:', error);
      throw error;
    }
  }
}

export default Member; 