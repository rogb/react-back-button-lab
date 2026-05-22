import { Card, CardContent, Typography } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
};

export default function PageCard({ title, children }: Props) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}
