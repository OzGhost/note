#!/bin/bash
set -e
lfile=/tmp/after-boots.log
echo > $lfile
echo "[i] Disable pci devices ..." | tee -a $lfile
lspci > /tmp/buf
ids="00:15.0 01:00.0 02:00.0 03:00.0"
for id in $ids; do
    echo "[i] .. Search for id $id ..." | tee -a $lfile
    txt=$(grep "^$id" /tmp/buf) || true
    if [ -n "$txt" ]; then
        echo "[i] .. .. Turning off device:  $txt" | tee -a $lfile
        echo 1 > "/sys/bus/pci/devices/0000:$id/remove"
    fi
done
echo "[i] Cleanup ..." | tee -a $lfile
rm /tmp/buf
echo "[i] launch adguard ..." | tee -a $lfile
adguardhome >/tmp/adguard.log 2>&1
