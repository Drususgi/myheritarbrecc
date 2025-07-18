#!/bin/bash

echo "🚀 Script pour pousser le code sur GitHub"
echo "========================================"
echo ""

# Vérifier l'état git
echo "📊 État actuel du repository :"
git status
echo ""

# Afficher les commits en attente
echo "📝 Commits à pousser :"
git log --oneline origin/main..HEAD 2>/dev/null || git log --oneline -2
echo ""

# Informations sur le remote
echo "🔗 Remote configuré :"
git remote -v
echo ""

# Instructions pour l'utilisateur
echo "✅ ÉTAPES POUR POUSSER SUR GITHUB :"
echo "=================================="
echo ""
echo "1. Si le repository n'existe pas encore sur GitHub :"
echo "   - Aller sur https://github.com/siin"
echo "   - Créer un nouveau repository 'myheritarbrecc'"
echo "   - Le laisser vide (pas de README, .gitignore, etc.)"
echo ""
echo "2. Ensuite, exécuter l'une de ces commandes :"
echo ""
echo "   OPTION A - Avec authentification HTTPS :"
echo "   git push -u origin main"
echo ""
echo "   OPTION B - Avec SSH (si configuré) :"
echo "   git remote set-url origin git@github.com:siin/myheritarbrecc.git"
echo "   git push -u origin main"
echo ""
echo "   OPTION C - Avec GitHub CLI (si installé) :"
echo "   gh auth login"
echo "   git push -u origin main"
echo ""
echo "🎯 Une fois poussé, le repository sera disponible à :"
echo "   https://github.com/siin/myheritarbrecc"
echo ""
echo "💾 VOTRE TRAVAIL EST DÉJÀ SAUVEGARDÉ LOCALEMENT !"
echo "   - 2 commits avec toutes les fonctionnalités"
echo "   - 47 fichiers trackés"
echo "   - Documentation complète dans CONVERSATION_BACKUP.md"
echo ""