# Skript treesitter grammar

Very basic grammar for the Skript language.

## Use with Helix and Nix/home-manager

Since Nix has a built in treesitter grammar build module, you should utilize that to declaratively use this grammar.

```
skriptHighlighting = pkgs.tree-sitter.buildGrammar {
  language = "skript";
  version = "local";
  src = ./skript-syntax-highlighting;
};
```

For home-manager and Helix specifically, you can use:

```
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
    source.path = "${./skript-syntax-highlighting}";
  }];
};

xdg.configFile = {
  "helix/runtime/queries/skript".source = ./skript-syntax-highlighting/queries;
  "helix/runtime/grammars/skript.so".source = "${skriptHighlighting}/parser";
};
```

This grammar only offers syntax highlighting at this time. PRs that expand functionality and add more syntax are accepted!
