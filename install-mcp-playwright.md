# Installation MCP Playwright pour Claude Code

## Étape 1: Localiser le fichier de configuration de Claude Desktop

Le fichier se trouve ici selon votre OS:

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

## Étape 2: Modifier le fichier de configuration

Ajoutez ou modifiez la section `mcpServers` dans le fichier:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-playwright"
      ],
      "env": {
        "PLAYWRIGHT_HEADLESS": "false"
      }
    }
  }
}
```

## Étape 3: Redémarrer Claude Desktop

Fermez complètement Claude Desktop et relancez-le.

## Étape 4: Vérifier l'installation

Dans Claude Code, vous devriez voir les nouveaux outils MCP Playwright disponibles:
- `mcp__playwright_navigate`
- `mcp__playwright_click`
- `mcp__playwright_fill`
- `mcp__playwright_screenshot`
- `mcp__playwright_get_text`
- etc.

## Utilisation pour debugger les cartes Home Assistant

Une fois configuré, nous pourrons:

1. Ouvrir automatiquement Home Assistant dans le navigateur
2. Naviguer vers les éditeurs de cartes
3. Tester les interactions avec les couleurs et options
4. Capturer des screenshots pour diagnostic
5. Inspecter le DOM pour vérifier l'application des CSS variables
6. Debugger le flux d'événements `_fireConfigChanged()`

## Exemple de test automatisé

```javascript
// Navigation vers Home Assistant
await mcp__playwright_navigate("http://homeassistant.local:8123");

// Ouvrir l'éditeur de carte
await mcp__playwright_click('[data-testid="card-editor"]');

// Tester le changement de couleur
await mcp__playwright_click('#header-color-picker');
await mcp__playwright_fill('input[type="color"]', '#ff0000');

// Vérifier que le changement est appliqué
const screenshot = await mcp__playwright_screenshot();
```

Cela nous permettra de diagnostiquer précisément pourquoi "L'enregistrement des paramètres ne semble pas marcher sur manager et dashboard".