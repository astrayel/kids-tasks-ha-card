// Lightweight DOM Diffing System for Incremental Updates

class KidsTasksDOMDiffer {
  constructor() {
    this.cache = new WeakMap();
  }

  // Main diff function - compares old and new HTML strings
  diff(element, newHTML, oldHTML = null) {
    if (!oldHTML) {
      oldHTML = this.cache.get(element) || '';
    }

    // Quick equality check
    if (oldHTML === newHTML) {
      return false; // No changes needed
    }

    // Parse HTML strings into virtual nodes
    const oldNodes = this.parseHTML(oldHTML);
    const newNodes = this.parseHTML(newHTML);

    // Perform the diff and apply changes
    const changes = this.diffNodes(oldNodes, newNodes);
    this.applyChanges(element, changes);

    // Cache the new HTML
    this.cache.set(element, newHTML);
    return true; // Changes were applied
  }

  // Parse HTML string into a simplified virtual DOM structure
  parseHTML(html) {
    if (!html || typeof html !== 'string') return [];

    // Create a temporary container
    const container = document.createElement('div');
    container.innerHTML = html.trim();

    return Array.from(container.childNodes).map(node => this.nodeToVirtual(node));
  }

  // Convert DOM node to virtual node representation
  nodeToVirtual(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return {
        type: 'text',
        content: node.textContent.trim(),
        raw: node.textContent
      };
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const virtual = {
        type: 'element',
        tag: node.tagName.toLowerCase(),
        attributes: {},
        children: [],
        key: null
      };

      // Extract attributes
      for (const attr of node.attributes) {
        virtual.attributes[attr.name] = attr.value;
        
        // Use data-id or id as key for efficient diffing
        if (attr.name === 'data-id' || attr.name === 'id') {
          virtual.key = attr.value;
        }
      }

      // Process children
      virtual.children = Array.from(node.childNodes)
        .map(child => this.nodeToVirtual(child))
        .filter(child => child !== null);

      return virtual;
    }

    return null; // Skip comments and other node types
  }

  // Diff two arrays of virtual nodes
  diffNodes(oldNodes, newNodes) {
    const changes = [];
    const maxLength = Math.max(oldNodes.length, newNodes.length);

    // Create key-based lookup for efficient matching
    const oldByKey = this.createKeyMap(oldNodes);
    const newByKey = this.createKeyMap(newNodes);

    for (let i = 0; i < maxLength; i++) {
      const oldNode = oldNodes[i];
      const newNode = newNodes[i];

      if (!oldNode && newNode) {
        // New node added
        changes.push({ type: 'add', index: i, node: newNode });
      } else if (oldNode && !newNode) {
        // Node removed
        changes.push({ type: 'remove', index: i });
      } else if (oldNode && newNode) {
        // Check for node changes
        const nodeChanges = this.diffSingleNode(oldNode, newNode, i);
        if (nodeChanges.length > 0) {
          changes.push(...nodeChanges);
        }
      }
    }

    return changes;
  }

  // Create a map of nodes by their keys for efficient lookup
  createKeyMap(nodes) {
    const map = new Map();
    nodes.forEach((node, index) => {
      if (node && node.key) {
        map.set(node.key, { node, index });
      }
    });
    return map;
  }

  // Diff two individual nodes
  diffSingleNode(oldNode, newNode, index) {
    const changes = [];

    // Text node comparison
    if (oldNode.type === 'text' && newNode.type === 'text') {
      if (oldNode.content !== newNode.content) {
        changes.push({
          type: 'text',
          index,
          content: newNode.content
        });
      }
      return changes;
    }

    // Element node comparison
    if (oldNode.type === 'element' && newNode.type === 'element') {
      // Different tag names = replace entire node
      if (oldNode.tag !== newNode.tag) {
        changes.push({
          type: 'replace',
          index,
          node: newNode
        });
        return changes;
      }

      // Compare attributes
      const attrChanges = this.diffAttributes(oldNode.attributes, newNode.attributes);
      if (attrChanges.length > 0) {
        changes.push({
          type: 'attributes',
          index,
          changes: attrChanges
        });
      }

      // Compare children
      const childChanges = this.diffNodes(oldNode.children, newNode.children);
      if (childChanges.length > 0) {
        changes.push({
          type: 'children',
          index,
          changes: childChanges
        });
      }
    }

    return changes;
  }

  // Diff attributes between two nodes
  diffAttributes(oldAttrs, newAttrs) {
    const changes = [];
    const allKeys = new Set([...Object.keys(oldAttrs), ...Object.keys(newAttrs)]);

    for (const key of allKeys) {
      const oldValue = oldAttrs[key];
      const newValue = newAttrs[key];

      if (oldValue !== newValue) {
        if (newValue === undefined) {
          changes.push({ type: 'remove', key });
        } else {
          changes.push({ type: 'set', key, value: newValue });
        }
      }
    }

    return changes;
  }

  // Apply changes to the actual DOM
  applyChanges(container, changes) {
    if (changes.length === 0) return;

    const elements = Array.from(container.children);

    for (const change of changes) {
      switch (change.type) {
        case 'add':
          this.applyAdd(container, change, elements);
          break;
        case 'remove':
          this.applyRemove(container, change, elements);
          break;
        case 'replace':
          this.applyReplace(container, change, elements);
          break;
        case 'text':
          this.applyText(container, change, elements);
          break;
        case 'attributes':
          this.applyAttributes(container, change, elements);
          break;
        case 'children':
          this.applyChildren(container, change, elements);
          break;
      }
    }
  }

  // Apply add change
  applyAdd(container, change, elements) {
    const newElement = this.virtualToDOM(change.node);
    if (change.index >= elements.length) {
      container.appendChild(newElement);
    } else {
      container.insertBefore(newElement, elements[change.index]);
    }
  }

  // Apply remove change
  applyRemove(container, change, elements) {
    const element = elements[change.index];
    if (element && element.parentNode === container) {
      container.removeChild(element);
    }
  }

  // Apply replace change
  applyReplace(container, change, elements) {
    const oldElement = elements[change.index];
    const newElement = this.virtualToDOM(change.node);
    
    if (oldElement && oldElement.parentNode === container) {
      container.replaceChild(newElement, oldElement);
    }
  }

  // Apply text change
  applyText(container, change, elements) {
    const element = elements[change.index];
    if (element && element.nodeType === Node.TEXT_NODE) {
      element.textContent = change.content;
    }
  }

  // Apply attribute changes
  applyAttributes(container, change, elements) {
    const element = elements[change.index];
    if (!element) return;

    for (const attrChange of change.changes) {
      if (attrChange.type === 'remove') {
        element.removeAttribute(attrChange.key);
      } else if (attrChange.type === 'set') {
        element.setAttribute(attrChange.key, attrChange.value);
      }
    }
  }

  // Apply children changes recursively
  applyChildren(container, change, elements) {
    const element = elements[change.index];
    if (element) {
      this.applyChanges(element, change.changes);
    }
  }

  // Convert virtual node back to real DOM element
  virtualToDOM(virtual) {
    if (virtual.type === 'text') {
      return document.createTextNode(virtual.raw || virtual.content);
    }

    if (virtual.type === 'element') {
      const element = document.createElement(virtual.tag);

      // Set attributes
      for (const [key, value] of Object.entries(virtual.attributes)) {
        element.setAttribute(key, value);
      }

      // Add children
      for (const child of virtual.children) {
        element.appendChild(this.virtualToDOM(child));
      }

      return element;
    }

    return document.createTextNode('');
  }

  // Utility method to clear cache for an element
  clearCache(element) {
    this.cache.delete(element);
  }

  // Get cache size for debugging
  getCacheSize() {
    return this.cache.size || 0;
  }
}

// Global singleton
const domDiffer = new KidsTasksDOMDiffer();

// Enhanced render method for base card
export function enhancedRender(element, newHTML) {
  // Use DOM diffing if available, fallback to innerHTML
  if (domDiffer && element.shadowRoot) {
    const container = element.shadowRoot;
    const hasChanges = domDiffer.diff(container, newHTML);
    
    if (hasChanges && typeof performanceMonitor !== 'undefined') {
      performanceMonitor?.trackDOMUpdate('diff', 1);
    }
    
    return hasChanges;
  } else {
    // Fallback to standard innerHTML replacement
    element.shadowRoot.innerHTML = newHTML;
    if (typeof performanceMonitor !== 'undefined') {
      performanceMonitor?.trackDOMUpdate('innerHTML', 1);
    }
    return true;
  }
}

export { KidsTasksDOMDiffer, domDiffer };
export default domDiffer;