import Types "../types/profile";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type ProfileState = {
    var name       : Text;
    var bio        : Text;
    var avatarBlob : ?Storage.ExternalBlob;
  };

  /// Return default (empty) profile state.
  public func defaultState() : ProfileState {
    {
      var name       = "My Profile";
      var bio        = "Welcome to my links";
      var avatarBlob = null;
    };
  };

  /// Read current profile as a shared-safe snapshot.
  public func get(state : ProfileState) : Types.Profile {
    {
      name       = state.name;
      bio        = state.bio;
      avatarBlob = state.avatarBlob;
    };
  };

  /// Overwrite profile fields.
  public func set(
    state      : ProfileState,
    name       : Text,
    bio        : Text,
    avatarBlob : ?Storage.ExternalBlob,
  ) : () {
    state.name       := name;
    state.bio        := bio;
    state.avatarBlob := avatarBlob;
  };
};
