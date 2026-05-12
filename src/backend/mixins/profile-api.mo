import ProfileLib "../lib/profile";
import ProfileTypes "../types/profile";
import Storage "mo:caffeineai-object-storage/Storage";

mixin (profileState : ProfileLib.ProfileState) {
  /// Return the public profile (readable by anyone).
  public query func getProfile() : async ProfileTypes.Profile {
    ProfileLib.get(profileState);
  };

  /// Overwrite profile fields; only canister owner may call.
  public shared ({ caller }) func setProfile(
    name       : Text,
    bio        : Text,
    avatarBlob : ?Storage.ExternalBlob,
  ) : async () {
    assert caller.isController();
    ProfileLib.set(profileState, name, bio, avatarBlob);
  };
};
