// Utility functions for detecting and displaying changes

/**
 * Get pending changes for a specific entity and field
 */
export const getPendingChanges = (changeRequests, entityType, entityId, fieldType) => {
  return changeRequests.filter(request => 
    request.entity === entityType && 
    request.entityId == entityId && 
    request.fieldType === fieldType &&
    request.status === 'pending'
  );
};

/**
 * Compare two arrays and return differences
 * For arrays of objects, compares by id if available, otherwise by index
 */
export const compareArrays = (oldArray = [], newArray = []) => {
  const changes = {
    added: [],
    removed: [],
    modified: []
  };

  // Ensure both parameters are arrays
  const oldArr = Array.isArray(oldArray) ? oldArray : [];
  const newArr = Array.isArray(newArray) ? newArray : [];

  // Handle arrays of objects with IDs
  if (oldArr.length > 0 && newArr.length > 0 && typeof oldArr[0] === 'object' && oldArr[0].id) {
    const oldMap = new Map(oldArr.map(item => [item.id, item]));
    const newMap = new Map(newArr.map(item => [item.id, item]));

    // Find added items
    for (const [id, item] of newMap) {
      if (!oldMap.has(id)) {
        changes.added.push(item);
      }
    }

    // Find removed items
    for (const [id, item] of oldMap) {
      if (!newMap.has(id)) {
        changes.removed.push(item);
      }
    }

    // Find modified items
    for (const [id, newItem] of newMap) {
      const oldItem = oldMap.get(id);
      if (oldItem && JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
        changes.modified.push({
          old: oldItem,
          new: newItem
        });
      }
    }
  } else {
    // Handle simple arrays or arrays without IDs
    const oldSet = new Set(oldArr);
    const newSet = new Set(newArr);

    // Find added items
    for (const item of newArr) {
      if (!oldSet.has(item)) {
        changes.added.push(item);
      }
    }

    // Find removed items
    for (const item of oldArr) {
      if (!newSet.has(item)) {
        changes.removed.push(item);
      }
    }
  }

  return changes;
};

/**
 * Format a value for display
 */
export const formatValue = (value) => {
  if (value === null || value === undefined) {
    return 'None';
  }
  if (typeof value === 'string' && value.trim() === '') {
    return 'Empty';
  }
  if (Array.isArray(value)) {
    return value.length === 0 ? 'Empty array' : `${value.length} items`;
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};

/**
 * Get display text for array changes
 */
export const getArrayChangeText = (changes) => {
  const parts = [];
  
  if (changes.added.length > 0) {
    parts.push(`+${changes.added.length} added`);
  }
  if (changes.removed.length > 0) {
    parts.push(`-${changes.removed.length} removed`);
  }
  if (changes.modified.length > 0) {
    parts.push(`${changes.modified.length} modified`);
  }
  
  return parts.join(', ');
};

/**
 * Check if there are any changes in an array comparison
 */
export const hasArrayChanges = (changes) => {
  return changes.added.length > 0 || changes.removed.length > 0 || changes.modified.length > 0;
};

/**
 * Aggregate multiple change requests for the same field into a single diff
 * This handles the new granular change request structure where each array item has its own request
 */
export const aggregateArrayChanges = (changeRequests) => {
  const changes = {
    added: [],
    removed: [],
    modified: []
  };

  changeRequests.forEach(request => {
    switch (request.action) {
      case 'add':
        if (request.newValue) {
          changes.added.push(request.newValue);
        }
        break;
      case 'delete':
        if (request.oldValue) {
          changes.removed.push(request.oldValue);
        }
        break;
      case 'update':
        if (request.oldValue && request.newValue) {
          changes.modified.push({
            old: request.oldValue,
            new: request.newValue
          });
        }
        break;
    }
  });

  return changes;
};
