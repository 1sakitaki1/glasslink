import List "mo:core/List";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  // ── Old stable types (inline copies from .old/) ──────────────────────────
  type OldLink = {
    id          : Nat;
    url         : Text;
    displayText : Text;
    icon        : ?Text;
    orderIndex  : Nat;
  };

  type OldProfileState = {
    var name      : Text;
    var bio       : Text;
    var avatarUrl : ?Text;
  };

  type OldActor = {
    profileState : OldProfileState;
    links        : List.List<OldLink>;
    counter      : { var next : Nat };
  };

  // ── New stable types (mirrors main.mo) ────────────────────────────────────
  type NewLink = OldLink; // Link type is unchanged

  type NewProfileState = {
    var name       : Text;
    var bio        : Text;
    var avatarBlob : ?Storage.ExternalBlob;
  };

  type NewActor = {
    profileState : NewProfileState;
    links        : List.List<NewLink>;
    counter      : { var next : Nat };
  };

  // ── Migration function ────────────────────────────────────────────────────
  public func migrate(old : OldActor) : NewActor {
    {
      profileState = {
        var name       = old.profileState.name;
        var bio        = old.profileState.bio;
        var avatarBlob = null; // avatarUrl dropped; new uploads start fresh
      };
      links   = old.links;
      counter = old.counter;
    }
  };
};
