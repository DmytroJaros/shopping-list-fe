import React from "react";

function MembersSection({ members, isOwner, isSaving, onInvite, onRemove, t }) {
  return (
    <section className="section">
      <div className="section-header">
        <h2>{t("members")}</h2>
        {isOwner && (
          <button
            type="button"
            className="btn-outline"
            onClick={onInvite}
            disabled={isSaving}
          >
            {t("inviteMember")}
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
              <div className="member-role">
                {member.role === "Owner" ? t("owner") : t("member")}
              </div>
            </div>

            {isOwner && member.role === "Member" && (
              <button
                type="button"
                className="btn-outline"
                onClick={() => onRemove(member.id)}
                disabled={isSaving}
              >
                {t("remove")}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
export default MembersSection;