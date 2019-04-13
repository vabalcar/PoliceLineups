#!/bin/sh

cur_depth=-1

sync_git_repo() {
    pwd
    if [ -z "$(git status -s)" ]; then
        git pull
        git push
    else
        git status
    fi
    echo
}

sync_git_structure() {
    if [ ! -d "$1" ]; then
        return
    fi
    
    ((++cur_depth))
    cd "$1"
    if [ -d '.git' ]; then
        sync_git_repo
    fi
    if [ $cur_depth -le "$2" ]; then
        find * -prune -type d -print 2> /dev/null | while IFS=\n read directory; do
            if [ "$directory" != '.git' ]; then
                sync_git_structure "$directory" "$2"
            fi
        done
    fi
    cd ..
    ((--cur_depth))
}

sync_git_structure $(pwd) 1
