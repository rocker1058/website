#!/bin/bash
set -e
cd ~/lawyer
git pull origin master
npm install --production
npm run build
pm2 restart lawyer
echo "✅ Deploy complete"
