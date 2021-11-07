#!/bin/sh

RUNAS="root"
INSTALL_DIR="/installation/direxctory/of/police/lineups"

start() {
    local CMD="start.ps1"
    su -c "$INSTALL_DIR/$CMD" $RUNAS
}

stop() {
    local CMD="stop.ps1"
    su -c "$INSTALL_DIR/$CMD" $RUNAS
}

restart() {
    local CMD="restart.ps1"
    su -c "$INSTALL_DIR/$CMD" $RUNAS
}

case "$1" in
start)
    start
    ;;
stop)
    stop
    ;;
retart)
    restart
    ;;
*)
    echo "Usage: $0 {start|stop|restart}"
    ;;
esac
