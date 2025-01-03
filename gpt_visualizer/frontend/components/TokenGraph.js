import React from 'react';
import { ForceGraph2D } from 'react-force-graph';

function TokenGraph({ data }) {
  return (
    <ForceGraph2D
      graphData={data}
      nodeAutoColorBy="id"
      nodeLabel="text"
      linkDirectionalParticles="value"
    />
  );
}

export default TokenGraph;