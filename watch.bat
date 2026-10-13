@echo off
title Klinika Kalina - Watcher HTML
echo ====================================================
echo  Watcher komponentow HTML (Klinika Piekna KALINA)
echo  Edytuj pliki w folderze: src\components\
echo  Plik produkcyjny produkcja\index.html tworzy sie sam!
echo ====================================================
echo.
node build.js --watch
pause
