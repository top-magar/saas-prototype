import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { AlertTriangle } from 'lucide-react';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertTriangle />
      <AlertTitle>Alert Title</AlertTitle>
      <AlertDescription>
        This is the alert description.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
    render: (args) => (
      <Alert {...args}>
        <AlertTriangle />
        <AlertTitle>Destructive Alert Title</AlertTitle>
        <AlertDescription>
          This is the destructive alert description.
        </AlertDescription>
      </Alert>
    ),
    args: {
        variant: 'destructive',
    }
  };
