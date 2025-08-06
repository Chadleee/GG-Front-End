import characterAPI from '../api/characters';
import { Character } from '../models/Character';

export class CharacterService {
  // Gallery operations
  static async updateGallery(characterId, gallery) {
    try {
      const character = await characterAPI.getById(characterId);
      const characterInstance = Character.fromData(character);
      const result = await characterInstance.updateGallery(gallery);
      return Character.fromData(result);
    } catch (error) {
      console.error('CharacterService: Failed to update gallery:', error);
      throw error;
    }
  }

  static async addImageToGallery(characterId, imageData) {
    try {
      const character = await characterAPI.getById(characterId);
      const characterInstance = Character.fromData(character);
      const result = await characterInstance.addImageToGallery(imageData);
      return Character.fromData(result);
    } catch (error) {
      console.error('CharacterService: Failed to add image to gallery:', error);
      throw error;
    }
  }

  static async updateImageInGallery(characterId, imageIndex, imageData) {
    try {
      const character = await characterAPI.getById(characterId);
      const characterInstance = Character.fromData(character);
      const result = await characterInstance.updateImageInGallery(imageIndex, imageData);
      return Character.fromData(result);
    } catch (error) {
      console.error('CharacterService: Failed to update image in gallery:', error);
      throw error;
    }
  }

  static async deleteImageFromGallery(characterId, imageIndex) {
    try {
      const character = await characterAPI.getById(characterId);
      const characterInstance = Character.fromData(character);
      const result = await characterInstance.deleteImageFromGallery(imageIndex);
      return Character.fromData(result);
    } catch (error) {
      console.error('CharacterService: Failed to delete image from gallery:', error);
      throw error;
    }
  }

  // Clips operations
  static async updateClips(characterId, clips) {
    try {
      const character = await characterAPI.getById(characterId);
      const characterInstance = Character.fromData(character);
      const result = await characterInstance.updateClips(clips);
      return Character.fromData(result);
    } catch (error) {
      console.error('CharacterService: Failed to update clips:', error);
      throw error;
    }
  }

  static async addClipToClips(characterId, clipData) {
    try {
      const character = await characterAPI.getById(characterId);
      const characterInstance = Character.fromData(character);
      const result = await characterInstance.addClipToClips(clipData);
      return Character.fromData(result);
    } catch (error) {
      console.error('CharacterService: Failed to add clip to clips:', error);
      throw error;
    }
  }

  static async updateClipInClips(characterId, clipIndex, clipData) {
    try {
      const character = await characterAPI.getById(characterId);
      const characterInstance = Character.fromData(character);
      const result = await characterInstance.updateClipInClips(clipIndex, clipData);
      return Character.fromData(result);
    } catch (error) {
      console.error('CharacterService: Failed to update clip in clips:', error);
      throw error;
    }
  }

  static async deleteClipFromClips(characterId, clipIndex) {
    try {
      const character = await characterAPI.getById(characterId);
      const characterInstance = Character.fromData(character);
      const result = await characterInstance.deleteClipFromClips(clipIndex);
      return Character.fromData(result);
    } catch (error) {
      console.error('CharacterService: Failed to delete clip from clips:', error);
      throw error;
    }
  }

  // General CRUD operations
  static async getAll() {
    try {
      const data = await characterAPI.getAll();
      return data.map(characterData => Character.fromData(characterData));
    } catch (error) {
      console.error('CharacterService: Failed to get all characters:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const data = await characterAPI.getById(id);
      return Character.fromData(data);
    } catch (error) {
      console.error('CharacterService: Failed to get character by id:', error);
      throw error;
    }
  }

  static async create(characterData) {
    try {
      const data = await characterAPI.create(characterData);
      return Character.fromData(data);
    } catch (error) {
      console.error('CharacterService: Failed to create character:', error);
      throw error;
    }
  }

  static async update(id, characterData) {
    try {
      const data = await characterAPI.update(id, characterData);
      return Character.fromData(data);
    } catch (error) {
      console.error('CharacterService: Failed to update character:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await characterAPI.delete(id);
      return true;
    } catch (error) {
      console.error('CharacterService: Failed to delete character:', error);
      throw error;
    }
  }
}

export default CharacterService; 