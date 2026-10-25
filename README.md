# Skript tree-sitter

Very basic grammar for the Skript language

## Use with Helix and Nix/home-manager

You should utilize Nix's built-in tree sitter grammar build module:

You can get `rev`/`hash` with `nix run nixpkgs#nix-prefetch-github -- AmazinAxel skript-treesitter`.

```nix
skriptTreesitterSrc = pkgs.fetchFromGitHub {
  owner = "AmazinAxel";
  repo = "skript-treesitter";
  rev = "c6194a5287b9c5cb878da91784185348cb148ea4";
  hash = "sha256-InzQY/oTPodPGjqYYR8/mtcgYdDjm1uUzYaKN6pxyOs=";
};
skriptTreesitter = pkgs.tree-sitter.buildGrammar {
  language = "skript";
  version = "1.0.0";
  src = skriptTreesitterSrc;
};
```

For home-manager and Helix specifically, you can use:

```nix
programs.helix.languages = {
  language = [{
    name = "skript";
    scope = "source.skript";
    file-types = [ "sk" ];
    roots = [ ];
    comment-token = "#";
    indent = {
      tab-width = 4;
      unit = "\t";
    };
    grammar = "skript";
  }];
  grammar = [{
    name = "skript";
    source.path = "${skriptTreesitterSrc}";
  }];
};

xdg.configFile = {
  "helix/runtime/queries/skript".source =  "${skriptTreesitterSrc}/queries";
  "helix/runtime/grammars/skript.so".source = "${skriptTreesitter}/parser";
};
```

This grammar only offers syntax highlighting at this time. PRs that expand functionality & adds vanilla/reflect syntax will be accepted!
