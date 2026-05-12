import List "mo:core/List";
import Common "../types/common";
import LinkTypes "../types/links";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";

module {
  public type LinkList = List.List<LinkTypes.Link>;
  public type Counter   = { var next : Nat };

  /// Create an empty link list.
  public func emptyList() : LinkList {
    List.empty<LinkTypes.Link>();
  };

  /// Create a fresh counter.
  public func newCounter() : Counter {
    { var next = 0 };
  };

  /// Return all links as an immutable array, sorted by orderIndex.
  public func list(links : LinkList) : [LinkTypes.Link] {
    let arr = links.toArray();
    arr.sort(func(a, b) = Nat.compare(a.orderIndex, b.orderIndex));
  };

  /// Add a new link; returns the assigned id.
  public func add(
    links      : LinkList,
    counter    : Counter,
    url        : Text,
    displayText: Text,
    icon       : ?Text,
    orderIndex : Nat,
  ) : Common.LinkId {
    let id = counter.next;
    counter.next += 1;
    links.add({ id; url; displayText; icon; orderIndex });
    id;
  };

  /// Update an existing link; traps if id not found.
  public func update(
    links      : LinkList,
    id         : Common.LinkId,
    url        : Text,
    displayText: Text,
    icon       : ?Text,
    orderIndex : Nat,
  ) : () {
    let idx = switch (links.findIndex(func(l) { l.id == id })) {
      case (?i) i;
      case null Runtime.trap("Link not found: " # debug_show id);
    };
    links.put(idx, { id; url; displayText; icon; orderIndex });
  };

  /// Delete a link by id; traps if id not found.
  public func remove(links : LinkList, id : Common.LinkId) : () {
    let filtered = links.filter(func(l) { l.id != id });
    links.clear();
    links.append(filtered);
  };
};
