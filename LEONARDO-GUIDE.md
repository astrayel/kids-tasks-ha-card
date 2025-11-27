# 🎨 Guide Leonardo.ai - Génération des Cosmétiques

**Temps estimé** : 1h30 pour 18 cosmétiques

---

## 📋 Checklist Rapide

```
☐ Inscription Leonardo.ai (gratuit)
☐ Configuration modèle RPG 4.0
☐ Activer "Transparent Background"
☐ Générer les 18 cosmétiques
☐ Télécharger et renommer
☐ Envoyer à Claude pour intégration
```

---

## 1️⃣ Setup Leonardo.ai (5 minutes)

### Inscription
1. Va sur **https://leonardo.ai**
2. Clique "Get Started" ou "Sign Up"
3. Inscris-toi avec Google/Email
4. Tu as **150 crédits gratuits par jour** (1 crédit = 1 image)

### Configuration Initiale
1. Dans l'interface, clique sur **"Image Generation"**
2. Sélectionne le modèle : **"RPG 4.0"** (dans la liste des modèles)
3. Configure les paramètres :
   - **Dimensions** : 512x512 (ratio 1:1)
   - **Number of Images** : 4 (pour avoir le choix)
   - **Guidance Scale** : 8
   - **⚠️ IMPORTANT** : Active **"Transparent Background"** (toggle ON)

---

## 2️⃣ Utilisation du Fichier CSV

### Ouvrir le CSV
- Fichier : `leonardo-prompts.csv`
- Tu peux l'ouvrir avec Excel, Google Sheets, ou un éditeur texte

### Structure
| Colonne | Description |
|---------|-------------|
| **Catégorie** | Type (Hair, Eyes, Outfit, Accessory) |
| **ID** | Identifiant technique |
| **Nom** | Nom français du cosmétique |
| **Prompt Positif** | Texte à copier dans Leonardo |
| **Prompt Négatif** | Texte à copier dans "Negative Prompt" |
| **Fichier** | Nom du fichier PNG à sauvegarder |

---

## 3️⃣ Workflow de Génération (5 min par item)

### Pour Chaque Ligne du CSV :

1. **Copier le Prompt Positif** (colonne 4)
   - Exemple : `cute child avatar head portrait, short brown hair...`

2. **Coller dans Leonardo.ai**
   - Dans le champ principal "Describe what you want to generate"

3. **Copier le Prompt Négatif** (colonne 5)
   - Exemple : `ugly, realistic, photo, complex background...`

4. **Coller dans "Negative Prompt"**
   - Clique sur "Negative Prompt" pour ouvrir le champ
   - Colle le texte

5. **Vérifier les Settings**
   - ✅ Modèle : RPG 4.0
   - ✅ 512x512
   - ✅ 4 images
   - ✅ Transparent Background : **ON**

6. **Générer**
   - Clique "Generate"
   - Attendre 10-20 secondes

7. **Sélectionner la Meilleure Image**
   - Parmi les 4 générées, choisis la plus belle

8. **Télécharger**
   - Clique sur l'image → "Download"
   - Renomme avec le nom de la colonne "Fichier"
   - Exemple : `hair_short_brown.png`

9. **Répéter** pour les 17 autres lignes du CSV

---

## 4️⃣ Organisation des Fichiers

### Structure Recommandée

```
📁 kids-tasks-cosmetics/
├── 📁 hair/
│   ├── hair_short_brown.png
│   ├── hair_short_blonde.png
│   ├── hair_long_brown.png
│   ├── hair_long_blonde.png
│   ├── hair_curly_black.png
│   └── hair_ponytail.png
├── 📁 eyes/
│   ├── eyes_happy.png
│   ├── eyes_neutral.png
│   └── eyes_excited.png
├── 📁 outfits/
│   ├── outfit_tshirt_blue.png
│   ├── outfit_tshirt_red.png
│   ├── outfit_tshirt_green.png
│   ├── outfit_dress_pink.png
│   └── outfit_hoodie_gray.png
└── 📁 accessories/
    ├── accessory_glasses.png
    ├── accessory_headphones.png
    ├── accessory_hat_pirate.png
    └── accessory_crown.png
```

**Total** : 18 fichiers PNG

---

## 5️⃣ Astuces Pro

### Si le Résultat N'est Pas Satisfaisant

**Option 1 : Régénérer**
- Clique "Generate" à nouveau
- Leonardo génère 4 nouvelles variantes

**Option 2 : Ajuster le Guidance**
- Augmente "Guidance Scale" à 10-12
- Plus fidèle au prompt

**Option 3 : Modifier le Prompt**
- Ajoute des mots-clés : `high quality, masterpiece, best quality`
- Enlève des éléments indésirables dans le Negative Prompt

### Pour Plus de Cohérence

- Génère tous les items **le même jour** (même session)
- Utilise **le même modèle** (RPG 4.0) pour tout
- Ne change pas la résolution (garde 512x512)

### Détourage Automatique

Leonardo fait le détourage automatiquement si "Transparent Background" est activé.

**Si le fond n'est pas transparent** :
- Vérifie que le toggle est bien ON
- Sinon utilise **remove.bg** après coup (5 images gratuites/mois)

---

## 6️⃣ Checklist de Génération

Coche au fur et à mesure :

### Cheveux (6/6)
- [ ] `hair_short_brown.png` - Cheveux courts bruns
- [ ] `hair_short_blonde.png` - Cheveux courts blonds
- [ ] `hair_long_brown.png` - Cheveux longs bruns
- [ ] `hair_long_blonde.png` - Cheveux longs blonds
- [ ] `hair_curly_black.png` - Cheveux bouclés noirs
- [ ] `hair_ponytail.png` - Queue de cheval

### Yeux (3/3)
- [ ] `eyes_happy.png` - Yeux joyeux
- [ ] `eyes_neutral.png` - Yeux neutres
- [ ] `eyes_excited.png` - Yeux excités

### Tenues (5/5)
- [ ] `outfit_tshirt_blue.png` - T-shirt bleu
- [ ] `outfit_tshirt_red.png` - T-shirt rouge
- [ ] `outfit_tshirt_green.png` - T-shirt vert
- [ ] `outfit_dress_pink.png` - Robe rose
- [ ] `outfit_hoodie_gray.png` - Hoodie gris

### Accessoires (4/4)
- [ ] `accessory_glasses.png` - Lunettes
- [ ] `accessory_headphones.png` - Casque audio
- [ ] `accessory_hat_pirate.png` - Chapeau pirate
- [ ] `accessory_crown.png` - Couronne

**Total : 18/18 ✅**

---

## 7️⃣ Une Fois Terminé

### Option A : Partage Direct
- Zippe le dossier `kids-tasks-cosmetics/`
- Partage via :
  - Google Drive
  - Dropbox
  - WeTransfer
  - Ou tout autre service

### Option B : Upload dans le Projet
- Place le dossier dans : `/home/user/kids-tasks-ha-card/assets/cosmetics/`
- Dis à Claude que c'est prêt

---

## 8️⃣ Ce Que Claude Fera Ensuite

Une fois que tu as les 18 PNG :

1. **Intégration dans `avatar-system.js`** (30 min)
   - Modification du code pour charger les PNG
   - Système de composition avec layers
   - Ordre de superposition (base → hair → eyes → outfit → accessory)

2. **Optimisation** (30 min)
   - Compression PNG (sans perte de qualité)
   - Cache système
   - Préchargement

3. **Tests** (30 min)
   - Vérification rendu dans les cartes
   - Tests de composition (différentes combinaisons)
   - Performance

**Total temps Claude** : 1h30

---

## 9️⃣ Estimation Totale

| Tâche | Temps | Responsable |
|-------|-------|-------------|
| Setup Leonardo.ai | 5 min | Toi |
| Génération 18 cosmétiques | 1h30 | Toi |
| Organisation fichiers | 15 min | Toi |
| **Total Toi** | **~2h** | |
| Intégration code | 1h30 | Claude |
| **TOTAL PROJET** | **~3h30** | |

---

## ❓ FAQ

**Q : Combien ça coûte ?**
R : Gratuit avec 150 crédits/jour. Tu as besoin de 18×4 = 72 crédits (en générant 4 images par item). Ça tient dans le quota gratuit.

**Q : Et si je n'aime pas un résultat ?**
R : Régénère autant de fois que tu veux. Avec 150 crédits, tu as de la marge.

**Q : Dois-je créer un compte payant ?**
R : Non, le gratuit suffit largement pour ce projet.

**Q : Combien de temps ça prend vraiment ?**
R : 5 min par cosmétique × 18 = 1h30. Ajoute 15 min d'organisation = 1h45 max.

**Q : Que faire si le fond n'est pas transparent ?**
R : Vérifie que "Transparent Background" est activé. Sinon utilise remove.bg après coup.

**Q : Puis-je changer les prompts ?**
R : Oui ! Le CSV est juste une base. Modifie selon tes goûts.

---

## 🚀 C'est Parti !

1. Ouvre **leonardo.ai**
2. Ouvre **leonardo-prompts.csv**
3. Copie-colle le premier prompt
4. Génère
5. Télécharge
6. Répète 17 fois
7. Zippe tout
8. Envoie à Claude

**Tu vas cartonner !** 💪

---

**Besoin d'aide ?** Reviens vers moi à tout moment si tu bloques sur une étape.
