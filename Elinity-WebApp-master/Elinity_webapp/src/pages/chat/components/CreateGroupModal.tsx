import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdClose, MdCheck, MdPeople, MdSearch } from 'react-icons/md';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { connectionsApi } from '../../../api/connections';
import { chatApi } from '../../../api/chat';
import './CreateGroupModal.css';

interface CreateGroupModalProps {
    onClose: () => void;
    onSuccess: (group: any) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, onSuccess }) => {
    const queryClient = useQueryClient();
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch confirmed connections
    const { data: connections, isLoading } = useQuery({
        queryKey: ['connections', 'matched'],
        queryFn: () => connectionsApi.listConnections('matched'),
    });

    const createMutation = useMutation({
        mutationFn: (data: { name: string, description: string, memberIds: string[] }) =>
            chatApi.setupGroup(data.name, data.description, data.memberIds),
        onSuccess: (newGroup) => {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
            onSuccess(newGroup);
        }
    });

    const toggleMember = (id: string) => {
        setSelectedMembers(prev =>
            prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
        );
    };

    const handleCreate = () => {
        if (!groupName.trim() || selectedMembers.length === 0) return;
        createMutation.mutate({
            name: groupName,
            description: description || `Group: ${groupName}`,
            memberIds: selectedMembers
        });
    };

    const filteredConnections = connections?.filter((conn: any) => {
        const name = conn.other_user_name?.toLowerCase() || '';
        return name.includes(searchTerm.toLowerCase());
    }) || [];

    return (
        <div className="modal-overlay">
            <div className="group-modal-container">
                <div className="group-modal-header">
                    <h3>Create New Sanctuary Group</h3>
                    <button className="close-btn" onClick={onClose}><MdClose /></button>
                </div>

                <div className="group-modal-body">
                    <div className="form-section">
                        <label>Group Name</label>
                        <Input
                            placeholder="e.g. Wellness Warriors"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            fullWidth
                        />
                    </div>

                    <div className="form-section">
                        <label>Purpose / Description</label>
                        <textarea
                            className="group-textarea"
                            placeholder="What is this group about?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="members-section">
                        <label>Add Members ({selectedMembers.length} selected)</label>
                        <div className="member-search">
                            <Input
                                placeholder="Search friends..."
                                leftIcon={<MdSearch />}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                fullWidth
                            />
                        </div>

                        <div className="members-list">
                            {isLoading ? (
                                <div className="loading-small">Loading connections...</div>
                            ) : filteredConnections.length > 0 ? (
                                filteredConnections.map((conn: any) => (
                                    <div
                                        key={conn.id}
                                        className={`member-select-item ${selectedMembers.includes(conn.other_user_id) ? 'selected' : ''}`}
                                        onClick={() => toggleMember(conn.other_user_id)}
                                    >
                                        <div className="member-avatar-mini">
                                            {conn.other_user_avatar ? <img src={conn.other_user_avatar} alt="" /> : <MdPeople />}
                                        </div>
                                        <div className="member-info-mini">
                                            <span>{conn.other_user_name || 'Legacy Member'}</span>
                                        </div>
                                        <div className="member-check-circle">
                                            {selectedMembers.includes(conn.other_user_id) && <MdCheck />}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-members">No connections found. Connect with others first to start a group!</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="group-modal-footer">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        variant="primary"
                        onClick={handleCreate}
                        disabled={!groupName.trim() || selectedMembers.length === 0 || createMutation.isPending}
                        loading={createMutation.isPending}
                    >
                        Create Group
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;
