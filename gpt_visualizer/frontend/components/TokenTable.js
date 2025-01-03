import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

function TokenTable({ tokens }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Token</TableCell>
          <TableCell>Probability</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tokens.map((token, index) => (
          <TableRow key={index}>
            <TableCell>{token.token}</TableCell>
            <TableCell>{token.probability.toFixed(4)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TokenTable;