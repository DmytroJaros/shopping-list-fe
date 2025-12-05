import React from "react";

function MembersSection({ members, isOwner, isSaving, onInvite, onRemove }) {
  return (
    <section className="section">
      <div className="section-header">
        <h2>Members</h2>
        {isOwner && (
          <button
            type="button"
            className="btn-outline"
            onClick={onInvite}
            disabled={isSaving}
          >
            Invite member
          </button>
        )}
      </div>

      <div className="members-list">
        {members.map((member) => (
          <div key={member.id} className="member-card">
            <div className="member-left">
              <div className="member-avatar">{member.initial}</div>
              <div>
                <div className="member-name">{member.name}</div>
                <div className="member-email">{member.email}</div>
              </div>
              <div className="member-role">{member.role}</div>
            </div>

            {isOwner && member.role === "Member" && (
              <button
                type="button"
                className="btn-outline"
                onClick={() => onRemove(member.id)}
                disabled={isSaving}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
export default MembersSection;