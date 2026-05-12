import Common "../types/common";
import LinkTypes "../types/links";
import LinksLib "../lib/links";

mixin (
  links   : LinksLib.LinkList,
  counter : LinksLib.Counter,
) {
  /// Return all links sorted by orderIndex (public read).
  public query func listLinks() : async [LinkTypes.Link] {
    LinksLib.list(links);
  };

  /// Add a link; only owner may call.
  public shared ({ caller }) func addLink(
    url         : Text,
    displayText : Text,
    icon        : ?Text,
    orderIndex  : Nat,
  ) : async Common.LinkId {
    assert caller.isController();
    LinksLib.add(links, counter, url, displayText, icon, orderIndex);
  };

  /// Update an existing link; only owner may call.
  public shared ({ caller }) func updateLink(
    id          : Common.LinkId,
    url         : Text,
    displayText : Text,
    icon        : ?Text,
    orderIndex  : Nat,
  ) : async () {
    assert caller.isController();
    LinksLib.update(links, id, url, displayText, icon, orderIndex);
  };

  /// Delete a link; only owner may call.
  public shared ({ caller }) func deleteLink(id : Common.LinkId) : async () {
    assert caller.isController();
    LinksLib.remove(links, id);
  };
};
