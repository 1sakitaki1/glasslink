import ProfileLib "lib/profile";
import LinksLib   "lib/links";
import ProfileApi "mixins/profile-api";
import LinksApi   "mixins/links-api";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Migration "migration";

(with migration = Migration.migrate)
actor {
  // --- Stable state ---
  let profileState = ProfileLib.defaultState();
  let links        = LinksLib.emptyList();
  let counter      = LinksLib.newCounter();

  // --- Seed sample links (run once on fresh install) ---
  do {
    ignore LinksLib.add(links, counter, "https://github.com", "GitHub", ?("\u{1F4BB}"), 0);
    ignore LinksLib.add(links, counter, "https://twitter.com", "Twitter / X", ?("\u{1F426}"), 1);
    ignore LinksLib.add(links, counter, "https://linkedin.com", "LinkedIn", ?("\u{1F4BC}"), 2);
  };

  // --- Mixins ---
  include MixinObjectStorage();
  include ProfileApi(profileState);
  include LinksApi(links, counter);
};
