import Common "common";

module {
  /// A single link entry stored in the profile.
  public type Link = {
    id          : Common.LinkId;
    url         : Text;
    displayText : Text;
    icon        : ?Text; // emoji or icon name, optional
    orderIndex  : Nat;   // used for manual ordering
  };
};
