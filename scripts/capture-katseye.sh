#!/bin/bash
set -e

CHROME="/home/ubuntu/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell"
URL="https://huskyfox.com/projects/katseye"

# Wait for page to load and capture at different times to catch animation frames
$CHROME --headless --screenshot=/tmp/katseye-1.png --window-size=1920,1080 --virtual-time-budget=2000 "$URL" 2>/dev/null

# Capture a few more frames by loading page multiple times with different timing
$CHROME --headless --screenshot=/tmp/katseye-2.png --window-size=1920,1080 --virtual-time-budget=4000 "$URL" 2>/dev/null

$CHROME --headless --screenshot=/tmp/katseye-3.png --window-size=1920,1080 --virtual-time-budget=6000 "$URL" 2>/dev/null

echo "Captured 3 frames"
