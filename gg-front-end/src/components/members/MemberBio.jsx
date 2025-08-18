import { Box } from '@mui/material';
import EditableExpandableCard from '../shared/editableComponents/EditableExpandableCard';
import { useMembers } from '../../contexts/MemberContext';

function MemberBio({ member, canEdit, onMemberUpdate }) {
  const { fetchMembers, getMemberById } = useMembers();

  const handleBioUpdate = async (newBio) => {
    try {
          await member.update(newBio, 'bio');
    await fetchMembers();
    const updatedMember = getMemberById(member.id);
    onMemberUpdate(updatedMember);
    } catch (err) {
      console.error('Failed to update member bio:', err);
    }
  };

  return (
    <EditableExpandableCard 
      title="Bio"
      value={member.bio}
      onSave={handleBioUpdate}
      entityType="member"
      entityId={member.id}
      fieldType="bio"
      placeholder="Enter member bio..."
      defaultExpanded={true}
      canEdit={canEdit}
    />
  );
}

export default MemberBio; 