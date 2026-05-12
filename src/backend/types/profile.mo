import Storage "mo:caffeineai-object-storage/Storage";
module {
  /// Public profile fields (shared-safe, no var fields).
  public type Profile = {
    name      : Text;
    bio       : Text;
    avatarBlob : ?Storage.ExternalBlob; // profile photo stored via object-storage extension
  };
};
