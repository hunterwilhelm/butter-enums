
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
  git tag "v$(jq .version package.json)" -m "$tagMessage"
  git push origin "v$(jq .version package.json)"
  read -p "Press any key to publish..."
  npm publish

  
