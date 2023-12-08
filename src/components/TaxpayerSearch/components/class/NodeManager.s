class NodeManager {
  private nodes: { [key: string]: React.ReactNode | undefined } = {};

  storeNode(key: string, renderFunction: () => React.ReactNode) {
    const renderedNode = renderFunction();
    if (renderedNode) {
      this.nodes[key] = renderedNode;
    }
  }

  getNode(key: string): React.ReactNode | undefined {
    return this.nodes[key];
  }

  removeNode(key: string) {
    delete this.nodes[key];
  }
}

export default NodeManager;
