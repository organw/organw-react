import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { select, boolean } from '@storybook/addon-knobs';

import { App, Menubar, MenuItem, Toolbar, ToolbarGroup, ToolbarItem, Editor, Statusbar } from './index';

function Default() {
  const [open, setOpen] = useState(false);
  return (
    <App>
      <Menubar>
        <MenuItem>
          File
        </MenuItem>
        <MenuItem>
          Help
        </MenuItem>
      </Menubar>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarItem>
            B
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem>
            H1
          </ToolbarItem>
          <ToolbarItem>
            H2
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
      <Editor />
      <Statusbar />
    </App>
  );
}

storiesOf('App', module)
  .add('default', () => <Default />);