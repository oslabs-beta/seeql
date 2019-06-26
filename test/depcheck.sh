#!/bin/bash
DIRNAME=${1:-.}
cd $DIRNAME

FILES=$(mktemp)
PACKAGES=$(mktemp)

find . \
    -path ./node_modules -prune -or \
    -path ./build -prune -or \
    \( -name "*.ts" -or -name "*.js" -or -name "*.json" \) -print > $FILES

function check {
    cat package.json \
        | jq "{} + .$1 | keys" \
        | sed -n 's/.*"\(.*\)".*/\1/p' > $PACKAGES

    echo "--------------------------"
    echo "Checking $1..."
    while read PACKAGE
    do
        RES=$(cat $FILES | xargs -I {} egrep -i "(import|require).*['\"]$PACKAGE[\"']" '{}' | wc -l)
        if [ $RES = 0 ]
        then
            echo -e "UNUSED\t\t $PACKAGE"
        else
            echo -e "USED ($RES)\t $PACKAGE"
        fi
    done < $PACKAGES
}

check "dependencies"
check "devDependencies"
check "peerDependencies"
