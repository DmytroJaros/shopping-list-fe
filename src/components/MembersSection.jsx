import React from "react";

function getContrastText(hexColor) {
  const clean = hexColor.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const toLinear = (value) => {
    const v = value / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const luminance =
    0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return luminance > 0.5 ? "#111827" : "#f9fafb";
}

function MembersSection({ members, isOwner, isSaving, onInvite, onRemove, t }) {
  const avatarColor = "#1d4ed8";
  const avatarTextColor = getContrastText(avatarColor);

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
              <div
                className="member-avatar"
                style={{ backgroundColor: avatarColor, color: avatarTextColor }}
              >
                {member.initial}
              </div>
              <div>
                <div className="member-name">{member.name}</div>
                <div className="member-email">{member.email}</div>
              </div>
              <div className="member-role">
                {member.role === "owner" || member.role === "Owner"
                  ? t("owner")
                  : t("member")}
              </div>
            </div>

            {isOwner &&
              (member.role === "member" || member.role === "Member") && (
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
