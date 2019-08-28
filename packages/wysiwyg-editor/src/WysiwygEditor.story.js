import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { select, boolean } from '@storybook/addon-knobs';

import WysiwygEditor from './index';

function Default() {
  const [open, setOpen] = useState(false);
  return (
    <WysiwygEditor />
  );
}

storiesOf('WysiwygEditor', module)
  .add('default', () => <Default />);