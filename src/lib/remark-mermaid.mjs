// Preserve diagram source as text so Markdown and MDX both escape it safely.
export function remarkMermaid() {
  return function transform(tree) {
    function visit(node) {
      if (node.type === 'code' && node.lang === 'mermaid') {
        const source = node.value;
        node.type = 'blockquote';
        node.data = { hName: 'figure', hProperties: { className: ['diagram'] } };
        node.children = [
          { type: 'paragraph', data: { hName: 'pre', hProperties: { className: ['mermaid-source'] } }, children: [{ type: 'text', value: source }] },
          { type: 'paragraph', data: { hName: 'figcaption' }, children: [{ type: 'text', value: 'Diagram' }] },
        ];
        delete node.value;
        delete node.lang;
        delete node.meta;
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
