
_default:
  #!/bin/bash
  just --list

release:
  #!/bin/bash
  version=$(jq -r .version package.json)
  echo "Releasing $version"
  read -p "Press any key to continue..."
  npm run test && npm run build
  read -p "Press any key to tag..."
  read -p "Type the tag message: " tagMessage
  git tag "v$version" -m "$tagMessage"
  git push origin "v$version"
  read -p "Press any key to publish..."
  npm publish
  gh release create "v$version" -t "Release $version" -n "$tagMessage"

  
